import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ReferralDTO } from 'rsd';
import client from '@/lib/http.config';

const BASE_URL = `/referral`;

class ReferralService {
  public static get(): Promise<ReferralDTO[]> {
    return client.get<ReferralDTO[]>(`${BASE_URL}`)
      .then((result) => result.data);
  }

  public static getById(id: string): Promise<ReferralDTO> {
    return client.get<ReferralDTO>(`${BASE_URL}/${id}`)
      .then((result) => result.data);
  }

  public static upsert(referral: Partial<ReferralDTO>): Promise<ReferralDTO> {
    return client.post<ReferralDTO>(
      `${BASE_URL}`,
      { ...referral },
    ).then((response) => response.data);
  }

  public static submit(id: string): Promise<ReferralDTO> {
    return client.put<ReferralDTO>(`${BASE_URL}/${id}/submit`)
      .then((res) => res.data);
  }
}

export const useGetReferralById = (id?: string) =>
  useQuery<ReferralDTO[] | ReferralDTO, Error>({
    enabled: !!id,
    queryFn: () => ReferralService.getById(id!),
    queryKey: [ `referral`, id ],
  });

export const useGetReferrals = () => useQuery<ReferralDTO[], Error>({
  queryFn: ReferralService.get,
  queryKey: [ `referrals` ],
});

export const useUpsertReferral = () => {
  const qc = useQueryClient();
  const referralsKey = [ `referrals` ];

  return useMutation<ReferralDTO, Error, Partial<ReferralDTO>, { previousReferrals: ReferralDTO[] | undefined }>({
    mutationFn: (referral) => ReferralService.upsert(referral),
    onError: (err, newReferral, context) => {
      if (context?.previousReferrals) {
        qc.setQueryData(referralsKey, context.previousReferrals);
      }
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: referralsKey });

      const previousReferrals = qc.getQueryData<ReferralDTO[]>(referralsKey);

      return { previousReferrals };
    },
    onSettled: async () => {
    },
    onSuccess: () => {
    },
  });
};

export const useSubmitReferral = () => {
  const qc = useQueryClient();

  const referralsKey = [ `referrals` ];

  return useMutation<
    ReferralDTO,
    Error,
    string,
    { previousReferrals: ReferralDTO[] | undefined }
  >({
    mutationFn: (id: string) => ReferralService.submit(id),
    onError: (err, newReferral, context) => {
      if (context?.previousReferrals) {
        qc.setQueryData(referralsKey, context.previousReferrals);
      }
    },
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: referralsKey });

      const previousReferrals = qc.getQueryData<ReferralDTO[]>(referralsKey);

      qc.setQueryData<ReferralDTO[]>(referralsKey, (old = []) => old.map((referral) =>
        referral.id === Number(id) ? { ...referral, completedAt: new Date() } : referral));

      return { previousReferrals };
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: referralsKey });
    },
  });
};
