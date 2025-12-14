export interface ITherapistServiceDistrict {
  createdAt: Date;
  deletedAt: Date;
  districtId: number;
  isExternal: boolean;
  serviceTypeId: number;
  studentId?: number;
  therapistId: number;
}
