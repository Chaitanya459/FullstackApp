import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as XLSX from 'xlsx';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

// Import types and config
import { ActiveStudent } from '../types/ActiveStudent';
import { CaseLoad } from '../types/CaseLoad';
import { HearingServicesDocumentation } from '../types/HearingServicesDocumentation';
import { VisionServicesDocumentation } from '../types/VisionServicesDocumentation';
import { type DatabaseConfig, getDatabaseConfig, logConfig } from './config';

// Load environment variables
dotenv.config();

class VisionHearingMigration {
  private pool: Pool;
  private dataDir: string;

  public constructor(config: DatabaseConfig) {
    this.pool = new Pool(config);
    this.dataDir = path.join(__dirname, `..`, `data`);
  }

  private safeStringValue(obj: unknown, key: string): string | undefined {
    if (obj && typeof obj === `object` && key in obj) {
      const value = (obj as Record<string, unknown>)[key];
      return typeof value === `string` ? value : undefined;
    }
    return undefined;
  }

  private safeNameParts(fullName: unknown): { firstName: string, lastName: string } | null {
    if (typeof fullName !== `string` || !fullName.trim()) {
      return null;
    }

    const nameParts = fullName.trim().split(` `);
    if (nameParts.length < 2) {
      return null;
    }

    const [ firstName, ...lastNameParts ] = nameParts;
    return {
      firstName,
      lastName: lastNameParts.join(` `),
    };
  }

  public async connect(): Promise<void> {
    try {
      await this.pool.connect();
      // eslint-disable-next-line no-console
      console.log(`Connected to PostgreSQL database`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error connecting to database:`, error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    await this.pool.end();
    // eslint-disable-next-line no-console
    console.log(`Disconnected from database`);
  }

  private readExcelFile<T>(filename: string, sheetName?: string): T[] {
    const filePath = path.join(this.dataDir, filename);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<T>(worksheet);

    // eslint-disable-next-line no-console
    console.log(`Read ${data.length} rows from ${filename}${sheetName ? ` (sheet: ${sheetName})` : ``}`);
    return data;
  }

  private async executeQuery<T extends QueryResultRow>(
    client: PoolClient,
    query: string,
    values?: any[],
  ): Promise<QueryResult<T>> {
    try {
      const result = await client.query<T>(query, values);
      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Query error:`, error);
      // eslint-disable-next-line no-console
      console.error(`Query:`, query);
      // eslint-disable-next-line no-console
      console.error(`Values:`, values);
      throw error;
    }
  }

  private async insertOrGetDistrict(client: PoolClient, name: string, escName?: string): Promise<number> {
    // Validate that name is not empty or undefined
    if (!name || typeof name !== `string` || !name.trim()) {
      throw new Error(`Invalid district name: "${name}"`);
    }

    const cleanName = name.trim();

    const selectQuery = `
      SELECT id FROM organization.districts
      WHERE name = $1 AND (esc_name = $2 OR (esc_name IS NULL AND $2 IS NULL))
    `;

    const result = await this.executeQuery<{ id: number }>(client, selectQuery, [ cleanName, escName ]);

    if (result.rows.length > 0) {
      return result.rows[0].id;
    }

    const insertQuery = `
      INSERT INTO organization.districts (name, esc_name, created_at, updated_at, created_by, updated_by)
      VALUES ($1, $2, NOW(), NOW(), 0, 0)
      RETURNING id
    `;

    const insertResult = await this.executeQuery<{ id: number }>(client, insertQuery, [ cleanName, escName ]);
    return insertResult.rows[0].id;
  }

  private async insertOrGetBuilding(client: PoolClient, name: string, districtId: number): Promise<number> {
    const selectQuery = `
      SELECT id FROM organization.buildings
      WHERE name = $1 AND district_id = $2
    `;

    const result = await this.executeQuery<{ id: number }>(client, selectQuery, [ name, districtId ]);

    if (result.rows.length > 0) {
      return result.rows[0].id;
    }

    const insertQuery = `
      INSERT INTO organization.buildings (name, district_id, created_at, updated_at, created_by, updated_by)
      VALUES ($1, $2, NOW(), NOW(), 0, 0)
      RETURNING id
    `;

    const insertResult = await this.executeQuery<{ id: number }>(client, insertQuery, [ name, districtId ]);
    return insertResult.rows[0].id;
  }

  private async insertOrGetStudent(
    client: PoolClient,
    firstName: string,
    lastName: string,
    gradeLevel?: string | number,
  ): Promise<number> {
    // Validate and clean the input data
    const cleanFirstName = this.cleanStudentName(firstName);
    const cleanLastName = this.cleanStudentName(lastName);

    if (!cleanFirstName || !cleanLastName) {
      throw new Error(`Invalid student name: "${firstName}" "${lastName}"`);
    }

    // First try to find existing student
    const findQuery = `
      SELECT id FROM people.students
      WHERE LOWER(first_name) = LOWER($1) AND LOWER(last_name) = LOWER($2)
    `;
    const findResult = await this.executeQuery(client, findQuery, [ cleanFirstName, cleanLastName ]);

    if (findResult.rows.length > 0) {
      return findResult.rows[0].id as number;
    }

    // Get grade level ID - use "Unknown" if not provided since grade_level_id is NOT NULL
    let gradeLevelId: number;
    if (gradeLevel !== undefined) {
      const gradeLevelStr = typeof gradeLevel === `number` ? gradeLevel.toString() : gradeLevel;
      gradeLevelId = await this.getOrCreateGradeLevel(client, gradeLevelStr);
    } else {
      gradeLevelId = await this.getOrCreateGradeLevel(client, `Unknown`);
    }

    // Insert new student
    const insertQuery = `
      INSERT INTO people.students (first_name, last_name, date_of_birth, grade_level_id, county,
                                   created_at, updated_at, created_by, updated_by)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), 0, 0)
      RETURNING id
    `;

    const insertResult = await this.executeQuery(client, insertQuery, [
      cleanFirstName,
      cleanLastName,
      undefined, // date_of_birth
      gradeLevelId,
      undefined, // county
    ]);

    return insertResult.rows[0].id as number;
  }

  private cleanStudentName(name: string): string {
    if (!name || typeof name !== `string`) {
      return ``;
    }

    // If the name looks like case notes (contains periods and is very long),
    // it's likely misplaced data - return empty to trigger error
    if (name.length > 50 && name.includes(`.`)) {
      return ``;
    }

    // Clean up the name
    return name.trim().substring(0, 50);
  }

  /**
   * Determines service type based on therapist role or column information
   */
  private determineServiceType(
    therapistColumn?: string,
    therapistName?: string,
    serviceProvider?: string,
  ): string {
    const text = (therapistColumn || therapistName || serviceProvider || ``).toLowerCase();

    // Check for specific role indicators
    if (text.includes(`audiologist`) || text.includes(`educational audiologist`)) {
      return `Audiologist`;
    }
    if (text.includes(`tvi`) || text.includes(`teacher of the visually impaired`) || text.includes(`vision teacher`)) {
      return `Teacher of the Visually Impaired`;
    }
    if (text.includes(`o&m`) || text.includes(`orientation and mobility`) || text.includes(`mobility specialist`)) {
      return `Orientation and Mobility`;
    }
    if (text.includes(`his`) || text.includes(`hearing instrument`) || text.includes(`hearing aid`) ||
      text.includes(`hearing specialist`)) {
      return `Hearing Instrument Specialist`;
    }

    // If unable to determine service type, throw an error
    const context = `therapistColumn: "${therapistColumn || `N/A`}", ` +
      `therapistName: "${therapistName || `N/A`}", ` +
      `serviceProvider: "${serviceProvider || `N/A`}"`;
    throw new Error(`Unable to determine service type from available information. Context: ${context}`);
  }

  /**
   * Look up service type from existing service assignments for a student-therapist pair
   */
  private async getServiceTypeFromAssignment(
    client: PoolClient,
    studentId: number,
    therapistId: number,
  ): Promise<number | null> {
    const query = `
      SELECT ssa.service_type_id
      FROM services.student_service_assignments ssa
      WHERE ssa.student_id = $1 AND ssa.therapist_id = $2
      LIMIT 1
    `;

    const result = await this.executeQuery(client, query, [ studentId, therapistId ]);

    if (result.rows.length === 0) {
      return null; // No assignment found
    }

    return result.rows[0].service_type_id as number;
  }

  private async getOrCreateGradeLevel(client: PoolClient, gradeLevel: string): Promise<number> {
    // First try to find existing grade level
    const selectQuery = `
      SELECT id FROM reference.grade_levels
      WHERE code = $1
    `;

    const result = await this.executeQuery<{ id: number }>(client, selectQuery, [ gradeLevel ]);

    if (result.rows.length > 0) {
      return result.rows[0].id;
    }

    // Create new grade level if it doesn't exist
    const insertQuery = `
      INSERT INTO reference.grade_levels (name, code, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING id
    `;

    const insertResult = await this.executeQuery<{ id: number }>(client, insertQuery, [ gradeLevel, gradeLevel ]);
    return insertResult.rows[0].id;
  }

  private async getServiceType(client: PoolClient, serviceTypeName: string): Promise<number> {
    // First try to find existing service type
    const selectQuery = `
      SELECT id FROM reference.service_types
      WHERE name = $1 OR code = $1
    `;

    const result = await this.executeQuery<{ id: number }>(client, selectQuery, [ serviceTypeName ]);

    if (result.rows.length > 0) {
      return result.rows[0].id;
    }

    throw new Error(`Service type not found: "${serviceTypeName}"`);
  }

  private async insertOrGetTherapist(
    client: PoolClient,
    firstName: string,
    lastName: string,
    email?: string,
  ): Promise<number> {
    const selectQuery = `
      SELECT id FROM identity.users
      WHERE first_name = $1 AND last_name = $2
    `;

    const result = await this.executeQuery<{ id: number }>(client, selectQuery, [ firstName, lastName ]);

    if (result.rows.length > 0) {
      return result.rows[0].id;
    }

    // For migration, we'll create basic user records with a temporary password
    const insertQuery = `
      INSERT INTO identity.users (first_name, last_name, email, password, created_by, updated_by,
                                  created_at, updated_at)
      VALUES ($1, $2, $3, $4, 0, 0, NOW(), NOW())
      RETURNING id
    `;

    const generatedEmail = email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@mcesc.org`;
    const tempPassword = `temp_password_change_me`; // Users will need to reset their passwords
    const insertResult = await this.executeQuery<{ id: number }>(
      client,
      insertQuery,
      [ firstName, lastName, generatedEmail, tempPassword ],
    );
    return insertResult.rows[0].id;
  }

  private async createServiceAssignment(
    client: PoolClient,
    studentId: number,
    therapistId: number,
    serviceType: string,
  ): Promise<void> {
    // Get or create the service type
    const serviceTypeId = await this.getServiceType(client, serviceType);

    // Check if assignment already exists
    const checkQuery = `
      SELECT id FROM services.student_service_assignments
      WHERE student_id = $1 AND service_type_id = $2
    `;

    const existingResult = await this.executeQuery<{ id: number }>(
      client,
      checkQuery,
      [ studentId, serviceTypeId ],
    );

    if (existingResult.rows.length === 0) {
      try {
        const insertQuery = `
          INSERT INTO services.student_service_assignments (student_id, therapist_id, service_type_id,
                                                             entry_date, created_at, updated_at, created_by, updated_by)
          VALUES ($1, $2, $3, NOW(), NOW(), NOW(), 0, 0)
        `;

        await this.executeQuery(client, insertQuery, [ studentId, therapistId, serviceTypeId ]);
      } catch (error: unknown) {
        // Ignore duplicate key errors, assignment already exists
        if (error instanceof Error && `code` in error && error.code === `23505`) {
          // Duplicate key error - assignment already exists, ignore
          return;
        }
        throw error; // Re-throw other errors
      }
    }
  }

  private parseDate(dateValue: string | number | undefined): string | null {
    if (!dateValue) {
      return null;
    }

    try {
      // Handle Excel date serial numbers (numbers)
      if (typeof dateValue === `number`) {
        const excelDate = new Date((dateValue - 25569) * 86400 * 1000);
        return excelDate.toISOString().split(`T`)[0];
      }

      // Handle string dates
      const dateStr = String(dateValue);
      if (!dateStr || dateStr.trim() === ``) {
        return null;
      }

      // Handle string that represents a number (Excel serial number as string)
      if (/^\d+$/.test(dateStr.trim())) {
        const excelDate = new Date((parseInt(dateStr.trim()) - 25569) * 86400 * 1000);
        return excelDate.toISOString().split(`T`)[0];
      }

      // Handle regular date strings
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return null;
      }

      return date.toISOString().split(`T`)[0];
    } catch {
      return null;
    }
  }

  public async migrateDistricts(client: PoolClient): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`Starting districts migration...`);

    const districtsData = this.readExcelFile<any>(`Vision & Hearing Service Districts.xlsx`);
    const uniqueDistricts = new Set<string>();

    // Extract unique district names from both Vision and Hearing columns
    for (const row of districtsData) {
      const visionDistrict = this.safeStringValue(row, `Vision`);
      const hearingDistrict = this.safeStringValue(row, `Hearing`);

      if (visionDistrict && visionDistrict.trim()) {
        uniqueDistricts.add(visionDistrict.trim());
      }
      if (hearingDistrict && hearingDistrict.trim()) {
        uniqueDistricts.add(hearingDistrict.trim());
      }
    }

    // Insert each unique district
    for (const districtName of uniqueDistricts) {
      await this.insertOrGetDistrict(client, districtName);
    }

    // eslint-disable-next-line no-console
    console.log(`Migrated ${uniqueDistricts.size} unique districts from ${districtsData.length} rows`);
  }

  public async migrateTherapists(client: PoolClient): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`Starting therapists migration...`);

    const therapistsData = this.readExcelFile<any>(`STAFF Hearing & Vision 2025  ddr.xlsx`);
    const uniqueTherapists = new Set<string>();

    // Extract therapist names from both Vision and Hearing columns
    // Skip the first row which contains job titles
    for (let i = 1; i < therapistsData.length; i += 1) {
      const row = therapistsData[i] as Record<string, unknown>;
      const visionTherapist = this.safeStringValue(row, `VISION DEPARTMENT`);
      const hearingTherapist = this.safeStringValue(row, `HEARING DEPARTMENT`);

      if (visionTherapist && visionTherapist.trim()) {
        const cleanName = visionTherapist.trim();
        // Skip if it looks like a job title (contains common title words)
        if (!cleanName.toLowerCase().includes(`teacher`) &&
          !cleanName.toLowerCase().includes(`tvi`) &&
          !cleanName.toLowerCase().includes(`audiologist`)) {
          uniqueTherapists.add(cleanName);
        }
      }

      if (hearingTherapist && hearingTherapist.trim()) {
        const cleanName = hearingTherapist.trim();
        // Skip if it looks like a job title
        if (!cleanName.toLowerCase().includes(`teacher`) &&
          !cleanName.toLowerCase().includes(`tvi`) &&
          !cleanName.toLowerCase().includes(`audiologist`)) {
          uniqueTherapists.add(cleanName);
        }
      }
    }

    // Insert each therapist
    for (const therapistName of uniqueTherapists) {
      const nameData = this.safeNameParts(therapistName);
      if (nameData) {
        await this.insertOrGetTherapist(client, nameData.firstName, nameData.lastName);
      }
    }

    // eslint-disable-next-line no-console
    console.log(`Migrated ${uniqueTherapists.size} unique therapists from ${therapistsData.length} rows`);
  }

  public async migrateTherapistDistricts(client: PoolClient): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`Starting therapist districts migration...`);

    // Extract therapist-district relationships from case loads
    await this.extractTherapistDistrictsFromCaseLoads(client, `Vision Department Case Loads.xlsx`);
    await this.extractTherapistDistrictsFromCaseLoads(client, `Hearing Case Loads.xlsx`);

    // Extract therapist-district relationships from service documentation
    await this.extractTherapistDistrictsFromDocumentation(
      client,
      `VI - Student Services Documentation (Responses).xlsx`,
    );
    await this.extractTherapistDistrictsFromDocumentation(client,
      `Hearing - Student Services Documentation (Responses).xlsx`);

    // eslint-disable-next-line no-console
    console.log(`Completed therapist districts migration`);
  }

  private async extractTherapistDistrictsFromCaseLoads(
    client: PoolClient,
    filename: string,
  ): Promise<void> {
    try {
      const filePath = path.join(this.dataDir, filename);
      const workbook = XLSX.readFile(filePath);

      // Get therapist names from sheet names (excluding dashboard sheets)
      const therapistSheets = workbook.SheetNames.filter(
        (name) => !name.toLowerCase().includes(`dashboard`) && name !== `Sheet1`,
      );

      for (const sheetName of therapistSheets) {
        const therapistName = sheetName.trim();
        const nameParts = therapistName.split(` `);

        if (nameParts.length >= 2) {
          const [ firstName ] = nameParts;
          const lastName = nameParts.slice(1).join(` `);

          try {
            const therapistId = await this.insertOrGetTherapist(client, firstName, lastName);

            // Read the sheet data to get districts
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json<any>(worksheet);

            // Extract unique districts from the data
            const districts = new Set<string>();
            for (const row of data) {
              const district = this.safeStringValue(row, `District`) ||
                this.safeStringValue(row, `Billing District`) ||
                this.safeStringValue(row, `district`);

              if (district && district.trim()) {
                districts.add(district.trim());
              }
            }

            // Insert therapist-district relationships
            for (const districtName of districts) {
              const districtId = await this.insertOrGetDistrict(client, districtName);

              // Determine service type from filename/therapist and get service type ID
              const serviceTypeName = filename.toLowerCase().includes(`vision`) ?
                `Teacher of the Visually Impaired` : `Audiologist`;
              const serviceTypeId = await this.getServiceType(client, serviceTypeName);

              const insertQuery = `
                INSERT INTO services.therapist_districts (therapist_id, district_id, service_type_id,
                                                           created_at, updated_at, created_by, updated_by)
                VALUES ($1, $2, $3, NOW(), NOW(), 0, 0)
                ON CONFLICT (therapist_id, district_id, service_type_id, deleted_at) DO NOTHING
              `;

              await this.executeQuery(client, insertQuery, [ therapistId, districtId, serviceTypeId ]);
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(`Could not process therapist sheet ${sheetName}:`, error);
          }
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error processing ${filename}:`, error);
    }
  }

  private async extractTherapistDistrictsFromDocumentation(
    client: PoolClient,
    filename: string,
  ): Promise<void> {
    try {
      const docs = this.readExcelFile<any>(filename);
      const therapistDistrictMap = new Map<string, Set<string>>();

      // Build map of therapist -> districts from service documentation
      for (const doc of docs) {
        const serviceProvider = this.safeStringValue(doc, `Service Provider`);
        const billingDistrict = this.safeStringValue(doc, `Billing District`);

        if (serviceProvider && billingDistrict) {
          if (!therapistDistrictMap.has(serviceProvider)) {
            therapistDistrictMap.set(serviceProvider, new Set());
          }
          therapistDistrictMap.get(serviceProvider)?.add(billingDistrict);
        }
      }

      // Insert therapist-district relationships
      for (const [ therapistName, districts ] of therapistDistrictMap) {
        const nameParts = therapistName.split(` `);
        if (nameParts.length >= 2) {
          const [ firstName ] = nameParts;
          const lastName = nameParts.slice(1).join(` `);

          try {
            const therapistId = await this.insertOrGetTherapist(client, firstName, lastName);

            for (const districtName of districts) {
              const districtId = await this.insertOrGetDistrict(client, districtName);

              // Determine service type from filename and get service type ID
              const serviceTypeName = filename.toLowerCase().includes(`vi`) ?
                `Teacher of the Visually Impaired` : `Audiologist`;
              const serviceTypeId = await this.getServiceType(client, serviceTypeName);

              const insertQuery = `
                INSERT INTO services.therapist_districts (therapist_id, district_id, service_type_id,
                                                           created_at, updated_at, created_by, updated_by)
                VALUES ($1, $2, $3, NOW(), NOW(), 0, 0)
                ON CONFLICT (therapist_id, district_id, service_type_id, deleted_at) DO NOTHING
              `;

              await this.executeQuery(client, insertQuery, [ therapistId, districtId, serviceTypeId ]);
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(`Could not process therapist ${therapistName}:`, error);
          }
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error processing ${filename}:`, error);
    }
  }

  private async processTherapistDistrictData(
    client: PoolClient,
    data: any[],
    filename: string,
  ): Promise<void> {
    for (const row of data) {
      const therapistName = this.safeStringValue(row, `Therapist Name`) || this.safeStringValue(row, `Full Name`);
      if (!therapistName) {
        continue;
      }

      const nameData = this.safeNameParts(therapistName);
      if (!nameData) {
        continue;
      }

      const therapistId = await this.insertOrGetTherapist(client, nameData.firstName, nameData.lastName);

      // Extract district names using safe string access
      const allKeys = Object.keys(row as Record<string, unknown>);
      const districtColumns = allKeys.filter((key) => {
        const value = this.safeStringValue(row, key);
        return key.toLowerCase().includes(`district`) && value && value.trim() !== ``;
      });

      for (const districtCol of districtColumns) {
        const districtName = this.safeStringValue(row, districtCol);
        if (districtName) {
          const districtId = await this.insertOrGetDistrict(client, districtName);

          // Determine service type from filename and get service type ID
          const serviceTypeName = filename.toLowerCase().includes(`vision`) ?
            `Teacher of the Visually Impaired` : `Audiologist`;
          const serviceTypeId = await this.getServiceType(client, serviceTypeName);

          // Insert therapist-district relationship
          const insertQuery = `
            INSERT INTO services.therapist_districts (therapist_id, district_id, service_type_id,
                                                       created_at, updated_at, created_by, updated_by)
            VALUES ($1, $2, $3, NOW(), NOW(), 0, 0)
            ON CONFLICT (therapist_id, district_id, service_type_id, deleted_at) DO NOTHING
          `;

          await this.executeQuery(client, insertQuery, [ therapistId, districtId, serviceTypeId ]);
        }
      }
    }
  }

  public async migrateActiveStudents(client: PoolClient): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`Starting active students migration...`);

    const students = this.readExcelFile<ActiveStudent>(`Active PS Student List by Grade.xlsx`, `All Active Students`);

    for (const student of students) {
      // Skip students without required fields
      const firstName = student[`Student First Name`];
      const lastName = student[`Student Last Name`];

      if (!firstName || !lastName || !firstName.trim() || !lastName.trim()) {
        continue; // Skip students without valid names
      }

      const studentId = await this.insertOrGetStudent(
        client,
        firstName.trim(),
        lastName.trim(),
        student[`Grade Level`],
      );

      // Skip enrollment if no billing district is provided
      const billingDistrictName = student[`Billing District`];
      if (!billingDistrictName || !billingDistrictName.trim()) {
        continue; // Skip this student's enrollment
      }

      const billingDistrictId = await this.insertOrGetDistrict(client, billingDistrictName.trim());
      const buildingId = student.Building ?
          await this.insertOrGetBuilding(client, student.Building, billingDistrictId) : null;

      // Insert student enrollment
      const enrollmentQuery = `
        INSERT INTO services.student_enrollments
        (student_id, billing_district_id, building_id, created_at, updated_at, created_by, updated_by)
        VALUES ($1, $2, $3, NOW(), NOW(), 0, 0)
      `;

      await this.executeQuery(client, enrollmentQuery, [ studentId, billingDistrictId, buildingId ]);
    }

    // eslint-disable-next-line no-console
    console.log(`Migrated ${students.length} active students`);
  }

  public async migrateCaseLoads(client: PoolClient): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`Starting case loads migration...`);

    // Process Hearing case loads (individual therapist sheets)
    await this.processHearingCaseLoads(client);

    // Process Vision case loads (individual therapist sheets)
    await this.processVisionCaseLoads(client);

    // eslint-disable-next-line no-console
    console.log(`Completed case loads migration`);
  }

  private async processCaseLoadData(
    client: PoolClient,
    caseLoads: CaseLoad[],
  ): Promise<void> {
    for (const caseLoad of caseLoads) {
      // Skip case loads without required student information
      const firstName = caseLoad[`Student First Name`];
      const lastName = caseLoad[`Student Last Name`];

      if (!firstName || !lastName || !firstName.trim() || !lastName.trim()) {
        continue; // Skip case loads without valid student names
      }

      const studentId = await this.insertOrGetStudent(
        client,
        firstName.trim(),
        lastName.trim(),
        caseLoad[`Grade Level`],
      );

      // Find therapist and determine service type based on role/column
      const audiologist = caseLoad[`Educational Audiologist`];
      const hearingSpecialist = caseLoad[`Hearing Specialist/Intervention/Therapy Provider`];

      // Process Educational Audiologist
      if (audiologist && audiologist.trim()) {
        const therapistName = audiologist.trim();
        const nameParts = this.safeNameParts(therapistName);
        if (nameParts) {
          try {
            const therapistId = await this.insertOrGetTherapist(
              client,
              nameParts.firstName,
              nameParts.lastName,
            );
            const serviceType = this.determineServiceType(`Educational Audiologist`, therapistName);
            await this.createServiceAssignment(client, studentId, therapistId, serviceType);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Error determining service type for audiologist "${therapistName}":`, error);
          }
        }
      }

      // Process Hearing Specialist/Intervention/Therapy Provider
      if (hearingSpecialist && hearingSpecialist.trim()) {
        const therapistName = hearingSpecialist.trim();
        const nameParts = this.safeNameParts(therapistName);
        if (nameParts) {
          try {
            const therapistId = await this.insertOrGetTherapist(
              client,
              nameParts.firstName,
              nameParts.lastName,
            );
            const serviceType = this.determineServiceType(
              `Hearing Specialist/Intervention/Therapy Provider`,
              therapistName,
            );
            await this.createServiceAssignment(client, studentId, therapistId, serviceType);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Error determining service type for hearing specialist "${therapistName}":`, error);
          }
        }
      }
    }
  }

  private async processHearingCaseLoads(client: PoolClient): Promise<void> {
    const workbook = XLSX.readFile(`data/Hearing Case Loads.xlsx`);

    // Skip the main dashboard sheet and process individual therapist sheets
    const therapistSheets = workbook.SheetNames.filter((name) => name !== `Therapists Dashboard`);

    for (const therapistSheetName of therapistSheets) {
      // Get therapist name from sheet name
      const therapistFullName = therapistSheetName.trim();
      const nameParts = therapistFullName.split(` `);
      const [ therapistFirstName, ...therapistLastNameParts ] = nameParts;
      const therapistLastName = therapistLastNameParts.join(` `);

      if (!therapistFirstName || !therapistLastName) {
        continue; // Skip if we can't parse the name
      }

      // Read student data from this therapist's sheet
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[therapistSheetName], { header: 1 });

      // Skip header row (index 0) and process student records
      for (let i = 1; i < (sheetData).length; i += 1) {
        const row = (sheetData as unknown[][])[i] as Array<string | undefined>;

        // Skip empty rows
        if (!row || row.length < 2) {
          continue;
        }

        // Student names are in columns 0 (last name) and 1 (first name)
        const studentLastName = row[0]?.toString().trim();
        const studentFirstName = row[1]?.toString().trim();
        const gradeLevel = row[6]?.toString().trim(); // Grade Level is in column 6

        if (!studentFirstName || !studentLastName) {
          continue; // Skip rows without valid student names
        }

        try {
          await this.insertOrGetStudent(
            client,
            studentFirstName,
            studentLastName,
            gradeLevel,
          );

          // Student processing complete - service assignments now handled in comprehensive method
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error processing hearing case load for ${studentFirstName} ${studentLastName}:`, error);
        }
      }
    }
  }

  private async processVisionCaseLoads(client: PoolClient): Promise<void> {
    const workbook = XLSX.readFile(`data/Vision Department Case Loads.xlsx`);

    // Skip the main dashboard sheet and process individual therapist sheets
    const therapistSheets = workbook.SheetNames.filter((name) => name !== `Therapists Dashboard`);

    for (const therapistSheetName of therapistSheets) {
      // Get therapist name from sheet name
      const therapistFullName = therapistSheetName.trim();
      const nameParts = therapistFullName.split(` `);
      const [ therapistFirstName, ...therapistLastNameParts ] = nameParts;
      const therapistLastName = therapistLastNameParts.join(` `);

      if (!therapistFirstName || !therapistLastName) {
        continue; // Skip if we can't parse the name
      }

      // Read student data from this therapist's sheet
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[therapistSheetName], { header: 1 });

      // Skip header row (index 0) and process student records
      for (let i = 1; i < (sheetData).length; i += 1) {
        const row = (sheetData as unknown[][])[i] as Array<string | undefined>;

        // Skip empty rows
        if (!row || row.length < 2) {
          continue;
        }

        // Student names are in columns 0 (last name) and 1 (first name)
        const studentLastName = row[0]?.toString().trim();
        const studentFirstName = row[1]?.toString().trim();
        const gradeLevel = row[6]?.toString().trim(); // Grade Level is in column 6

        if (!studentFirstName || !studentLastName) {
          continue; // Skip rows without valid student names
        }

        try {
          await this.insertOrGetStudent(
            client,
            studentFirstName,
            studentLastName,
            gradeLevel,
          );

          // Student processing complete - service assignments now handled in comprehensive method
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error processing vision case load for ${studentFirstName} ${studentLastName}:`, error);
        }
      }
    }
  }

  /**
   * Process service assignments from columns L-O in case load sheets
   */
  private async processServiceAssignmentColumns(
    client: PoolClient,
    studentId: number,
    row: Array<string | undefined>,
  ): Promise<void> {
    // Column L (11): Educational Audiologist
    const audiologist = row[11]?.toString().trim();
    if (audiologist && audiologist !== ``) {
      const nameData = this.safeNameParts(audiologist);
      if (nameData) {
        try {
          const therapistId = await this.insertOrGetTherapist(
            client,
            nameData.firstName,
            nameData.lastName,
          );
          await this.createServiceAssignment(client, studentId, therapistId, `Audiologist`);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error creating audiologist assignment for "${audiologist}":`, error);
        }
      }
    }

    // Column M (12): Hearing Instrument Specialist
    const hearingSpecialist = row[12]?.toString().trim();
    if (hearingSpecialist && hearingSpecialist !== ``) {
      const nameData = this.safeNameParts(hearingSpecialist);
      if (nameData) {
        try {
          const therapistId = await this.insertOrGetTherapist(
            client,
            nameData.firstName,
            nameData.lastName,
          );
          await this.createServiceAssignment(client, studentId, therapistId, `Hearing Instrument Specialist`);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error creating hearing specialist assignment for "${hearingSpecialist}":`, error);
        }
      }
    }

    // Column N (13): Teacher of the Visually Impaired
    const visionTeacher = row[13]?.toString().trim();
    if (visionTeacher && visionTeacher !== ``) {
      const nameData = this.safeNameParts(visionTeacher);
      if (nameData) {
        try {
          const therapistId = await this.insertOrGetTherapist(
            client,
            nameData.firstName,
            nameData.lastName,
          );
          await this.createServiceAssignment(client, studentId, therapistId, `Teacher of the Visually Impaired`);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error creating vision teacher assignment for "${visionTeacher}":`, error);
        }
      }
    }

    // Column O (14): Orientation and Mobility
    const mobilitySpecialist = row[14]?.toString().trim();
    if (mobilitySpecialist && mobilitySpecialist !== ``) {
      const nameData = this.safeNameParts(mobilitySpecialist);
      if (nameData) {
        try {
          const therapistId = await this.insertOrGetTherapist(
            client,
            nameData.firstName,
            nameData.lastName,
          );
          await this.createServiceAssignment(client, studentId, therapistId, `Orientation and Mobility`);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error creating mobility specialist assignment for "${mobilitySpecialist}":`, error);
        }
      }
    }
  }

  public async migrateAllStudentInformation(client: PoolClient): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`Starting All Student Information migration...`);

    const filePath = path.join(this.dataDir, `All Student Information (Responses).xlsx`);
    const workbook = XLSX.readFile(filePath);
    const sheetName = `All Students`;
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      // eslint-disable-next-line no-console
      console.log(`Sheet "${sheetName}" not found in All Student Information file`);
      return;
    }

    const data: unknown[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Skip header row
    for (let i = 1; i < data.length; i += 1) {
      const row = data[i];
      if (!row || row.length === 0) {
        continue;
      }

      try {
        // Get student info
        const lastName = row[0]?.toString().trim();
        const firstName = row[1]?.toString().trim();

        if (!lastName || !firstName) {
          continue;
        }

        await this.insertOrGetStudent(client, firstName, lastName);

        // Student processing complete - service assignments now handled in comprehensive method
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error processing All Student Information row ${i + 1}:`, error);
      }
    }

    // eslint-disable-next-line no-console
    console.log(`Completed All Student Information migration`);
  }

  private async processAllStudentServiceAssignments(
    client: PoolClient,
    row: unknown[],
    studentId: number,
  ): Promise<void> {
    // Column indices based on the header row we saw:
    // 3: Assigned TVI, 4: TVI Entry Date
    // 7: O&M Specialist, 8: O/M Entry Date
    // 11: Educational Audiologist, 12: Aud Entry Date
    // 15: Hearing Specialist, 16: HIS Entry Date

    // Process TVI (Teacher of Visually Impaired)
    // eslint-disable-next-line prefer-destructuring
    const tviName = row[3];
    // eslint-disable-next-line prefer-destructuring
    const tviEntryDate = row[4];
    if (tviName && typeof tviName === `string` && tviName.trim() !== ``) {
      await this.createAllStudentServiceAssignment(
        client, studentId, tviName.trim(), `Teacher of the Visually Impaired`, tviEntryDate,
      );
    }

    // Process O&M (Orientation and Mobility)
    // eslint-disable-next-line prefer-destructuring
    const omName = row[7];
    // eslint-disable-next-line prefer-destructuring
    const omEntryDate = row[8];
    if (omName && typeof omName === `string` && omName.trim() !== ``) {
      await this.createAllStudentServiceAssignment(
        client, studentId, omName.trim(), `Orientation and Mobility`, omEntryDate,
      );
    }

    // Process Educational Audiologist
    // eslint-disable-next-line prefer-destructuring
    const audName = row[11];
    // eslint-disable-next-line prefer-destructuring
    const audEntryDate = row[12];
    if (audName && typeof audName === `string` && audName.trim() !== ``) {
      await this.createAllStudentServiceAssignment(
        client, studentId, audName.trim(), `Audiologist`, audEntryDate,
      );
    }

    // Process Hearing Specialist
    // eslint-disable-next-line prefer-destructuring
    const hisName = row[15];
    // eslint-disable-next-line prefer-destructuring
    const hisEntryDate = row[16];
    if (hisName && typeof hisName === `string` && hisName.trim() !== ``) {
      await this.createAllStudentServiceAssignment(
        client, studentId, hisName.trim(), `Hearing Instrument Specialist`, hisEntryDate,
      );
    }
  }

  private async createAllStudentServiceAssignment(
    client: PoolClient,
    studentId: number,
    therapistName: string,
    serviceType: string,
    entryDate: unknown,
  ): Promise<void> {
    const nameData = this.safeNameParts(therapistName);
    if (!nameData) {
      // eslint-disable-next-line no-console
      console.log(`Invalid therapist name format: "${therapistName}"`);
      return;
    }

    try {
      const therapistId = await this.insertOrGetTherapist(
        client,
        nameData.firstName,
        nameData.lastName,
      );

      // Get the service type ID
      const serviceTypeId = await this.getServiceType(client, serviceType);

      // Convert entry date to PostgreSQL date format
      const [ entryDateStr ] = new Date().toISOString().split(`T`); // Default to today

      if (entryDate) {
        if (typeof entryDate === `number`) {
          // Excel date serial number
          const excelDate = new Date((entryDate - 25569) * 86400 * 1000);
          const [ excelDateStr ] = excelDate.toISOString().split(`T`);
          await this.createServiceAssignmentWithDate(client, studentId, therapistId, serviceTypeId, excelDateStr);
          return;
        } else if (typeof entryDate === `string`) {
          const parsedDate = new Date(entryDate);
          if (!isNaN(parsedDate.getTime())) {
            const [ parsedDateStr ] = parsedDate.toISOString().split(`T`);
            await this.createServiceAssignmentWithDate(client, studentId, therapistId, serviceTypeId, parsedDateStr);
            return;
          }
        }
      }

      await this.createServiceAssignmentWithDate(client, studentId, therapistId, serviceTypeId, entryDateStr);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error creating service assignment for "${therapistName}" (${serviceType}):`, error);
    }
  }

  private async createServiceAssignmentWithDate(
    client: PoolClient,
    studentId: number,
    therapistId: number,
    serviceTypeId: number,
    entryDate: string,
  ): Promise<void> {
    try {
      const query = `
        INSERT INTO services.student_service_assignments
        (student_id, therapist_id, service_type_id, entry_date, created_at, updated_at, created_by, updated_by)
        VALUES ($1, $2, $3, $4, NOW(), NOW(), 0, 0)
      `;
      await client.query(query, [ studentId, therapistId, serviceTypeId, entryDate ]);
    } catch (error) {
      // Ignore unique constraint violations (duplicates)
      if (error && typeof error === `object` && `code` in error && error.code !== `23505`) {
        throw error;
      }
    }
  }

  /**
   * Migrate service assignments using both All Student Information and Case Load data
   * to create a comprehensive set of service assignments with minimal gaps
   */
  public async migrateComprehensiveServiceAssignments(client: PoolClient): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`Starting comprehensive service assignments migration...`);

    // First, process service assignments from All Student Information (more complete)
    await this.processAllStudentServiceAssignmentsOnly(client);

    // Then, supplement with case load data for any missing assignments
    await this.processCaseLoadServiceAssignmentsOnly(client);

    // eslint-disable-next-line no-console
    console.log(`Completed comprehensive service assignments migration`);
  }

  /**
   * Process service assignments from All Student Information file only
   */
  private async processAllStudentServiceAssignmentsOnly(client: PoolClient): Promise<void> {
    const filePath = path.join(this.dataDir, `All Student Information (Responses).xlsx`);
    const workbook = XLSX.readFile(filePath);
    const sheetName = `All Students`;
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      // eslint-disable-next-line no-console
      console.log(`Sheet "${sheetName}" not found in All Student Information file`);
      return;
    }

    const data: unknown[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    let processedCount = 0;

    // Skip header row
    for (let i = 1; i < data.length; i += 1) {
      try {
        const row = data[i];
        const lastName = row[1]?.toString().trim(); // Column B: Student Last Name
        const firstName = row[2]?.toString().trim(); // Column C: Student First Name

        if (!lastName || !firstName) {
          continue;
        }

        const studentId = await this.insertOrGetStudent(client, firstName, lastName);
        if (!studentId) {
          continue;
        }

        // Process service assignments with entry dates using column indices
        await this.processAllStudentServiceAssignments(client, row, studentId);
        processedCount += 1;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error processing All Student Information row ${i + 1}:`, error);
      }
    }

    // eslint-disable-next-line no-console
    console.log(`Processed ${processedCount} All Student Information records for service assignments`);
  }

  /**
   * Process service assignments from Case Load files to fill gaps
   */
  private async processCaseLoadServiceAssignmentsOnly(client: PoolClient): Promise<void> {
    let hearingProcessedCount = 0;
    let visionProcessedCount = 0;

    // Process Hearing case loads
    const hearingWorkbook = XLSX.readFile(`data/Hearing Case Loads.xlsx`);
    const hearingTherapistSheets = hearingWorkbook.SheetNames.filter((name) => name !== `Therapists Dashboard`);

    for (const therapistSheetName of hearingTherapistSheets) {
      const sheetData = XLSX.utils.sheet_to_json(hearingWorkbook.Sheets[therapistSheetName], { header: 1 });

      for (let i = 1; i < (sheetData).length; i += 1) {
        const row = (sheetData as unknown[][])[i] as Array<string | undefined>;

        if (!row || row.length < 2) {
          continue;
        }

        const studentLastName = row[0]?.toString().trim();
        const studentFirstName = row[1]?.toString().trim();

        if (!studentFirstName || !studentLastName) {
          continue;
        }

        try {
          const studentId = await this.insertOrGetStudent(client, studentFirstName, studentLastName);
          if (studentId) {
            await this.processServiceAssignmentColumns(client, studentId, row);
            hearingProcessedCount += 1;
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error processing hearing case load for ${studentFirstName} ${studentLastName}:`, error);
        }
      }
    }

    // Process Vision case loads
    const visionWorkbook = XLSX.readFile(`data/Vision Department Case Loads.xlsx`);
    const visionTherapistSheets = visionWorkbook.SheetNames.filter((name) => name !== `Therapists Dashboard`);

    for (const therapistSheetName of visionTherapistSheets) {
      const sheetData = XLSX.utils.sheet_to_json(visionWorkbook.Sheets[therapistSheetName], { header: 1 });

      for (let i = 1; i < (sheetData).length; i += 1) {
        const row = (sheetData as unknown[][])[i] as Array<string | undefined>;

        if (!row || row.length < 2) {
          continue;
        }

        const studentLastName = row[0]?.toString().trim();
        const studentFirstName = row[1]?.toString().trim();

        if (!studentFirstName || !studentLastName) {
          continue;
        }

        try {
          const studentId = await this.insertOrGetStudent(client, studentFirstName, studentLastName);
          if (studentId) {
            await this.processServiceAssignmentColumns(client, studentId, row);
            visionProcessedCount += 1;
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error processing vision case load for ${studentFirstName} ${studentLastName}:`, error);
        }
      }
    }

    // eslint-disable-next-line no-console
    console.log(`Processed ${hearingProcessedCount} hearing case load records and ` +
      `${visionProcessedCount} vision case load records for service assignments`);
  }

  public async migrateServicesDocumentation(client: PoolClient): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`Starting services documentation migration...`);

    // Process Hearing services documentation
    const hearingDocs = this.readExcelFile<HearingServicesDocumentation>(
      `Hearing - Student Services Documentation (Responses).xlsx`,
    );
    await this.processServicesDocumentation(client, hearingDocs);

    // Process Vision services documentation
    const visionDocs = this.readExcelFile<VisionServicesDocumentation>(
      `VI - Student Services Documentation (Responses).xlsx`,
    );
    await this.processVisionServicesDocumentation(client, visionDocs);

    // eslint-disable-next-line no-console
    console.log(`Completed services documentation migration`);
  }

  private async processServicesDocumentation(
    client: PoolClient,
    docs: HearingServicesDocumentation[],
  ): Promise<void> {
    let processedCount = 0;
    let skippedCount = 0;

    for (const doc of docs) {
      try {
        const studentId = await this.insertOrGetStudent(
          client,
          doc[`Student First Name`],
          doc[`Student Last Name`],
        );

        const nameParts = doc[`Service Provider`].split(` `);
        const [ firstName ] = nameParts;
        const lastName = nameParts.slice(1).join(` `);
        const therapistId = await this.insertOrGetTherapist(client, firstName, lastName);

        // Skip records without billing district
        const billingDistrictName = doc[`Billing District`];
        if (!billingDistrictName || !billingDistrictName.trim()) {
          skippedCount += 1;
          continue;
        }

        const billingDistrictId = await this.insertOrGetDistrict(client, billingDistrictName);

        // Get service type from existing service assignment
        const serviceTypeId = await this.getServiceTypeFromAssignment(client, studentId, therapistId);

        if (serviceTypeId === null) {
          // eslint-disable-next-line no-console
          console.log(`No service assignment found for student ${studentId} and ` +
            `therapist ${therapistId} - skipping documentation record`);
          skippedCount += 1;
          continue;
        }

        const documentationQuery = `
          INSERT INTO services.documentation
          (student_id, therapist_id, billing_district_id, service_date, created_at,
           case_notes, direct_minutes, indirect_minutes, travel_minutes, service_type_id,
           updated_at, created_by, updated_by)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), 0, 0)
        `;

        await this.executeQuery(client, documentationQuery, [
          studentId,
          therapistId,
          billingDistrictId,
          this.parseDate(doc.Date),
          this.parseDate(doc.Timestamp),
          doc[`Case Notes`],
          doc[`Direct Minutes`],
          doc[`Indirect Minutes`],
          doc[`Travel Minutes`],
          serviceTypeId,
        ]);

        processedCount += 1;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        // eslint-disable-next-line no-console
        console.log(`Skipping invalid record: ${errorMessage}`);
        // eslint-disable-next-line no-console
        console.log(`Student: "${doc[`Student First Name`]}" "${doc[`Student Last Name`]}"`);
        skippedCount += 1;
      }
    }

    // eslint-disable-next-line no-console
    console.log(`Processed ${processedCount} hearing documentation entries, ` +
      `skipped ${skippedCount} invalid records`);
  }

  private async processVisionServicesDocumentation(
    client: PoolClient,
    docs: VisionServicesDocumentation[],
  ): Promise<void> {
    let processedCount = 0;
    let skippedCount = 0;

    for (const doc of docs) {
      try {
        const studentId = await this.insertOrGetStudent(
          client,
          doc[`Student First Name`],
          doc[`Student Last Name`],
        );

        const nameParts = doc[`Service Provider`].split(` `);
        const [ firstName ] = nameParts;
        const lastName = nameParts.slice(1).join(` `);
        const therapistId = await this.insertOrGetTherapist(client, firstName, lastName);

        // Skip records without billing district
        const billingDistrictName = doc[`Billing District`];
        if (!billingDistrictName || !billingDistrictName.trim()) {
          skippedCount += 1;
          continue;
        }

        const billingDistrictId = await this.insertOrGetDistrict(client, billingDistrictName);

        // Get service type from existing service assignment
        const serviceTypeId = await this.getServiceTypeFromAssignment(client, studentId, therapistId);

        if (serviceTypeId === null) {
          // eslint-disable-next-line no-console
          console.log(`No service assignment found for vision student ${studentId} and ` +
            `therapist ${therapistId} - skipping documentation record`);
          skippedCount += 1;
          continue;
        }

        const documentationQuery = `
          INSERT INTO services.documentation
          (student_id, therapist_id, billing_district_id, service_date,
           case_notes, direct_minutes, indirect_minutes, travel_minutes, service_type_id,
           created_at, updated_at, created_by, updated_by)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), 0, 0)
        `;

        await this.executeQuery(client, documentationQuery, [
          studentId,
          therapistId,
          billingDistrictId,
          this.parseDate(doc.Date),
          doc[`Case Notes`],
          doc[`Direct Minutes`],
          doc[`Indirect Minutes`],
          doc[`Travel Minutes`],
          serviceTypeId,
        ]);

        processedCount += 1;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        // eslint-disable-next-line no-console
        console.log(`Skipping invalid Vision record: ${errorMessage}`);
        // eslint-disable-next-line no-console
        console.log(`Student: "${doc[`Student First Name`]}" "${doc[`Student Last Name`]}"`);
        skippedCount += 1;
      }
    }

    // eslint-disable-next-line no-console
    console.log(`Processed ${processedCount} vision documentation entries, ` +
      `skipped ${skippedCount} invalid records`);
  }

  public async runMigration(): Promise<void> {
    const client = await this.pool.connect();

    try {
      await this.connect();

      // eslint-disable-next-line no-console
      console.log(`Starting Vision Hearing Migration...`);

      // Run migrations in order
      await this.migrateDistricts(client);
      await this.migrateTherapists(client);
      await this.migrateTherapistDistricts(client);
      await this.migrateActiveStudents(client);
      await this.migrateCaseLoads(client);
      await this.migrateAllStudentInformation(client);
      await this.migrateComprehensiveServiceAssignments(client);
      await this.migrateServicesDocumentation(client);

      // eslint-disable-next-line no-console
      console.log(`Migration completed successfully!`);
      process.exit(0);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Migration failed:`, error);
      process.exit(1);
    } finally {
      client.release();
      await this.disconnect();
    }
  }
}

// Main execution
async function main() {
  const config = getDatabaseConfig();
  logConfig(config);

  const migration = new VisionHearingMigration(config);
  await migration.runMigration();
}

if (require.main === module) {
  main().catch((error: Error) => {
    // eslint-disable-next-line no-console
    console.error(`Migration failed:`, error);
    process.exit(1);
  });
}

export { VisionHearingMigration };
