import { useQuery } from '@tanstack/react-query';
import { GradeLevelDTO } from 'rsd';
import client from '@/lib/http.config';

const BASE_URL = `/grade-level`;

class GradeLevelService {
  public static get(): Promise<GradeLevelDTO[]> {
    return client.get<GradeLevelDTO[]>(`${BASE_URL}`)
      .then((result) => result.data);
  }
}

export const useGetGradeLevels = () => useQuery<GradeLevelDTO[], Error>({
  queryFn: GradeLevelService.get,
  queryKey: [ `grade-levels` ],
});
