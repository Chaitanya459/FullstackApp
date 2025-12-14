import { GradeLevelDTO } from '../reference';
import { BuildingDTO, DistrictDTO } from '../organization';
import { StudentDTO } from '../people';

export interface StudentEnrollmentDTO {
  id: number;
  academicYearId?: number;
  billingDistrict?: DistrictDTO;
  billingDistrictId: number;
  building?: BuildingDTO;
  buildingId?: number;
  createdAt: Date;
  createdBy: number;
  deletedAt?: Date;
  deletedBy?: number | null;
  districtOfAttendance?: DistrictDTO;
  districtOfAttendanceId?: number;
  districtOfResidence?: DistrictDTO;
  districtOfResidenceId?: number;
  enrollmentDate: Date;
  exitDate?: Date;
  gradeLevel?: GradeLevelDTO;
  gradeLevelId: number;
  roomNumber?: number;
  student?: StudentDTO;
  studentId: number;
  teacherName?: string;
  updatedAt: Date;
  updatedBy: number;
}
