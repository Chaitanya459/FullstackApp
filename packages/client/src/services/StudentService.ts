import { useQuery } from '@tanstack/react-query';
import {
  GetStudentByIdDTO,
  GetStudentMonthlySummaryDTO,
  GetStudentsDTO,
  GetStudentSummaryDTO,
  StudentDTO,
  StudentMonthlySummaryDTO,
  StudentSummaryDTO,
} from 'rsd';
import client from '@/lib/http.config';

const BASE_URL = `/student`;

class StudentService {
  public static get(params: GetStudentsDTO = {}): Promise<StudentDTO[]> {
    return client.get<StudentDTO[]>(`${BASE_URL}`, { params })
      .then((result) => result.data);
  }

  public static getById(studentId: number | null, params: GetStudentByIdDTO): Promise<StudentDTO> {
    return client.get<StudentDTO>(`${BASE_URL}/${studentId}`, { params })
      .then((res) => res.data);
  }

  public static getSummary(params: GetStudentSummaryDTO): Promise<StudentSummaryDTO[]> {
    const { yearId, ...otherParams } = params;

    return client.get<StudentSummaryDTO[]>(`${BASE_URL}/summary`, {
      params: { ...otherParams, yearId },
    })
      .then((result) => result.data);
  }

  public static getMonthlySummary(params: GetStudentMonthlySummaryDTO): Promise<StudentMonthlySummaryDTO[]> {
    const { yearId } = params;

    return client.get<StudentMonthlySummaryDTO[]>(`${BASE_URL}/monthly-summary`, {
      params: { yearId },
    })
      .then((result) => result.data);
  }
}

export const useGetStudentById = (studentId: number | null, enabled = true, params: GetStudentByIdDTO = {}) =>
  useQuery<StudentDTO, Error, StudentDTO, [string, number | null, GetStudentByIdDTO]>(
    {
      enabled: enabled && studentId !== null,
      queryFn: () => StudentService.getById(studentId, params),
      queryKey: [ `studentData`, studentId, params ],
    },
  );

export const useGetStudents = (params: GetStudentsDTO = {}, enabled = true) =>
  useQuery<StudentDTO[], Error>({
    enabled,
    queryFn: () => StudentService.get(params),
    queryKey: [ `students`, params ],
  });

export const useGetStudentsSummary = (params: GetStudentSummaryDTO, enabled = true) =>
  useQuery<StudentSummaryDTO[], Error>({
    enabled,
    queryFn: () => StudentService.getSummary(params),
    queryKey: [ `studentSummary`, params ],
  });

export const useGetStudentsMonthlySummary = (params: GetStudentMonthlySummaryDTO, enabled = true) =>
  useQuery<StudentMonthlySummaryDTO[], Error>({
    enabled,
    queryFn: () => StudentService.getMonthlySummary(params),
    queryKey: [ `studentMonthlySummary`, params ],
  });
