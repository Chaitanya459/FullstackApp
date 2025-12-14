import { QueryFunctionContext, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateUserDTO, GetUserDTO, UpdateUserDTO, UserDTO } from 'rsd';
import client from '@/lib/http.config';

const BASE_URL = `/user`;

class UserService {
  public static search(params: GetUserDTO): Promise<UserDTO[]> {
    return client.get<UserDTO[]>(`${BASE_URL}`, { params })
      .then((result) => result.data);
  }

  public static getById(id: number): Promise<UserDTO> {
    return client.get<UserDTO>(`${BASE_URL}/${id}`)
      .then((result) => result.data);
  }

  public static create(dto: CreateUserDTO): Promise<UserDTO> {
    return client.post<UserDTO>(`${BASE_URL}`, dto)
      .then((result) => result.data);
  }

  public static update(id: number, dto: UpdateUserDTO): Promise<UserDTO> {
    return client.put<UserDTO>(`${BASE_URL}/${id}`, dto)
      .then((result) => result.data);
  }

  public static async delete(id: number): Promise<void> {
    await client.delete(`${BASE_URL}/${id}`);
  }

  public static async restore(id: number): Promise<void> {
    await client.put(`${BASE_URL}/${id}/restore`);
  }

  public static getMe(): Promise<UserDTO> {
    return client.get<UserDTO>(`${BASE_URL}/me`)
      .then((result) => result.data);
  }
}

export const useSearchUsers = (query: GetUserDTO = {}) => useQuery<UserDTO[], Error>({
  queryFn: ({ queryKey }: QueryFunctionContext) => UserService.search(queryKey[1] as GetUserDTO),
  queryKey: [ `users`, query ],
});

export const useGetMe = (enabled = true) => useQuery<UserDTO | null, Error>({
  enabled,
  queryFn: () => UserService.getMe(),
  queryKey: [ `user` ],
});

export const useGetUser = (id: number) => useQuery<UserDTO, Error>({
  queryFn: ({ queryKey }: QueryFunctionContext) => UserService.getById(queryKey[1] as number),
  queryKey: [ `users`, id ],
});

export const useCreateUser = () => {
  const qc = useQueryClient();
  const usersKey = [ `users`, {}];

  return useMutation<UserDTO, Error, Omit<UserDTO, `id`>, { previousUsers: UserDTO[] | undefined }>({
    mutationFn: (user) => UserService.create({ user }),
    onError: (err, newUser, context) => {
      if (context?.previousUsers) {
        qc.setQueryData(usersKey, context.previousUsers);
      }
    },
    onMutate: async (newUser) => {
      await qc.cancelQueries({ queryKey: usersKey });

      const previousUsers = qc.getQueryData<UserDTO[]>(usersKey);
      const tempUser: UserDTO = { ...newUser, id: Date.now() };

      qc.setQueryData<UserDTO[]>(usersKey, (old = []) => [ ...old, tempUser ]);

      return { previousUsers };
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: usersKey });
    },
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation<UserDTO, Error, {
    id: number;
    user: UpdateUserDTO[`user`];
  }, {
    previousUsers: UserDTO[] | undefined;
  }>({
    mutationFn: ({ id, user }) => UserService.update(id, { user }),
    mutationKey: [ `update-user` ],
    onError: (error, updatedUser, context) => {
      if (context?.previousUsers) {
        qc.setQueryData([ `users` ], context.previousUsers);
      }
    },
    onMutate: async ({ id, user }) => {
      await qc.cancelQueries({ queryKey: [ `users` ] });

      const previousUsers = qc.getQueryData<UserDTO[]>([ `users` ]);

      qc.setQueryData<UserDTO[]>([ `users` ], (old) =>
        old?.map((u) => (u.id === id ? { ...u, ...user } : u)) || []);

      return { previousUsers };
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: [ `users` ] });
    },
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();

  return useMutation<void, Error, number, { previousUsers?: UserDTO[] }>({
    mutationFn: (id) => UserService.delete(id),
    mutationKey: [ `delete-user` ],
    onSettled: async (_data, _err, id) => {
      await qc.invalidateQueries({ queryKey: [ `users` ] });
      if (typeof id === `number`) {
        await qc.invalidateQueries({ queryKey: [ `users`, id ] });
      }
    },
  });
};

export const useRestoreUser = () => {
  const qc = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => UserService.restore(id),
    mutationKey: [ `restore-user` ],
    onSettled: async (_data, _err, id) => {
      await qc.invalidateQueries({ queryKey: [ `users` ] });
      if (typeof id === `number`) {
        await qc.invalidateQueries({ queryKey: [ `users`, id ] });
      }
    },
  });
};
