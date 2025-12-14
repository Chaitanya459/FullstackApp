import { useQuery } from '@tanstack/react-query';
import { GenderDTO } from 'rsd';
import client from '@/lib/http.config';

const BASE_URL = `/gender`;

class GenderService {
  public static get(): Promise<GenderDTO[]> {
    return client.get<GenderDTO[]>(`${BASE_URL}`)
      .then((result) => result.data);
  }
}

export const useGetGenders = () => useQuery<GenderDTO[], Error>({
  queryFn: GenderService.get,
  queryKey: [ `genders` ],
});
