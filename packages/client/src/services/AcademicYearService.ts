import { useQuery } from '@tanstack/react-query';
import { AcademicYearDTO } from 'rsd';
import client from '@/lib/http.config';

const BASE_URL = `/academic-year`;

class AcademicYearService {
  public static get(): Promise<AcademicYearDTO[]> {
    return client.get<AcademicYearDTO[]>(`${BASE_URL}`)
      .then((result) => result.data);
  }
}

export const useGetAcademicYears = () => useQuery<AcademicYearDTO[], Error>({
  queryFn: () => AcademicYearService.get(),
  queryKey: [ `academic-years` ],
});
