import { useQuery } from '@tanstack/react-query';
import { RoleDTO } from 'rsd';
import client from '@/lib/http.config';

const BASE_URL = `/role`;

class RoleService {
  public static getAll(): Promise<RoleDTO[]> {
    return client.get<RoleDTO[]>(`${BASE_URL}`)
      .then((result) => result.data);
  }
}

export const useGetRoles = () => useQuery<RoleDTO[], Error>({
  queryFn: () => RoleService.getAll(),
  queryKey: [ `roles` ],
});
