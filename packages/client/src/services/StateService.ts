import { useQuery } from '@tanstack/react-query';
import { StateDTO } from 'rsd';
import client from '@/lib/http.config';

const BASE_URL = `/state`;

class StateService {
  public static get(): Promise<StateDTO[]> {
    return client.get<StateDTO[]>(`${BASE_URL}`)
      .then((result) => result.data);
  }
}

export const useGetStates = () => useQuery<StateDTO[], Error>({
  queryFn: StateService.get,
  queryKey: [ `states` ],
});
