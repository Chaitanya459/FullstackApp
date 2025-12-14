import { useQuery } from '@tanstack/react-query';
import { ServiceTypeGroupDTO } from 'rsd';
import client from '@/lib/http.config';

const BASE_URL = `/service-type-group`;

class ServiceTypeGroupService {
  public static get(): Promise<ServiceTypeGroupDTO[]> {
    return client.get<ServiceTypeGroupDTO[]>(`${BASE_URL}`)
      .then((result) => result.data);
  }
}

export const useGetServiceTypeGroups = () => useQuery<ServiceTypeGroupDTO[], Error>({
  queryFn: () => ServiceTypeGroupService.get(),
  queryKey: [ `service-type-groups` ],
});
