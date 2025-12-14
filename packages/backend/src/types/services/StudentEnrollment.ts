import { IAudited, IGradeLevel } from 'types';
import { IBuilding, IDistrict } from '../organization';
import { IStudent } from '../people';

export interface IStudentEnrollment extends IAudited {
  id: number;
  academicYearId?: number;
  billingDistrict?: IDistrict;
  billingDistrictId: number;
  building?: IBuilding;
  buildingId?: number;
  createdAt: Date;
  districtOfAttendance?: IDistrict;
  districtOfAttendanceId?: number;
  districtOfResidence?: IDistrict;
  districtOfResidenceId?: number;
  enrollmentDate: Date;
  exitDate?: Date;
  gradeLevel?: IGradeLevel;
  gradeLevelId: number;
  roomNumber?: number;
  student?: IStudent;
  studentId: number;
  teacherName?: string;
  updatedAt: Date;
}
