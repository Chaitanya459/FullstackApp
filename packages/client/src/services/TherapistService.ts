import { useQuery } from '@tanstack/react-query';
import { GetDistrictTherapistInputDTO, TherapistSummaryDTO } from 'rsd';
import client from '@/lib/http.config';

const BASE_URL = `/therapist`;

class TherapistService {
  public static get(params: GetDistrictTherapistInputDTO = {}): Promise<TherapistSummaryDTO[]> {
    return client.get<TherapistSummaryDTO[]>(`${BASE_URL}`, { params })
      .then((result) => result.data);
  }
}

export const useGetDistrictTherapists = (params: GetDistrictTherapistInputDTO = {}, enabled = true) =>
  useQuery<TherapistSummaryDTO[], Error>({
    enabled,
    queryFn: () => TherapistService.get(params),
    queryKey: [ `therapists`, params ],
  });
