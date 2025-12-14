import { useMutation, useQuery } from '@tanstack/react-query';
import { DistrictDTO, DistrictSummaryDTO, DistrictSummaryParamsDTO } from 'rsd';
import client from '@/lib/http.config';
import { downloadFile } from '@/utils/downloadFile';

const BASE_URL = `/district`;

class DistrictService {
  public static get(): Promise<DistrictDTO[]> {
    return client.get<DistrictDTO[]>(`${BASE_URL}`)
      .then((result) => result.data || []);
  }

  public static getSummaryList(params: DistrictSummaryParamsDTO): Promise<DistrictSummaryDTO[]> {
    return client.get<DistrictSummaryDTO[]>(`${BASE_URL}/summary`, { params })
      .then((result) => result.data || []);
  }

  public static async exportDistricts(params?: DistrictSummaryParamsDTO): Promise<void> {
    const response = await client.post<BlobPart>(
      `${BASE_URL}/export`,
      params,
      { responseType: `blob` },
    );
    downloadFile(response);
  }
}

export const useGetDistricts = () => useQuery<DistrictDTO[], Error>({
  queryFn: () => DistrictService.get(),
  queryKey: [ `districts` ],
});

export const useGetDistrictSummaryList = (params: DistrictSummaryParamsDTO) => useQuery<DistrictSummaryDTO[], Error>({
  queryFn: () => DistrictService.getSummaryList(params),
  queryKey: [ `districtSummary`, params ],
});

export const useExportDistricts = () =>
  useMutation<void, Error, DistrictSummaryParamsDTO>({
    mutationFn: (params) => DistrictService.exportDistricts(params),
  });
