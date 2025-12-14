export interface DistrictDTO {
  id: number;
  createdAt: Date;
  createdBy: number;
  deletedAt?: Date;
  deletedBy?: number | null;
  escName?: string;
  name: string;
  updatedAt: Date;
  updatedBy: number;
}
