import { useQuery } from '@tanstack/react-query';
import { GetServiceTypeReportDTO, ServiceTypeDTO } from 'rsd';
import client from '@/lib/http.config';

const BASE_URL = `/service-type`;

class ServiceTypeService {
  public static get(): Promise<ServiceTypeDTO[]> {
    return client.get<ServiceTypeDTO[]>(`${BASE_URL}`)
      .then((res) => res.data);
  }

  public static getServiceTypeReport(): Promise<GetServiceTypeReportDTO[]> {
    return client.get<GetServiceTypeReportDTO[]>(`${BASE_URL}/report`)
      .then((res) => res.data);
  }
}

export const useGetServiceTypes = () => useQuery<ServiceTypeDTO[], Error>({
  queryFn: () => ServiceTypeService.get(),
  queryKey: [ `service-types` ],
});

export const useGetServiceTypeReport = () => useQuery<GetServiceTypeReportDTO[], Error>({
  queryFn: () => ServiceTypeService.getServiceTypeReport(),
  queryKey: [ `reports` ],
});
