import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import * as cookie from 'cookie';
import { LoginDTO } from 'rsd';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AuthService, useGetMe } from '@/services';
import { AsyncPageWrapper } from '@/components/async-page-wrapper';
import { AuthContext } from '@/contexts/AuthContext';

const checkIsAuthenticated = () => {
  const { spa_token } = cookie.parse(document.cookie);
  return spa_token ? !!JSON.parse(spa_token) : false;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = (props: any) => {
  const [ isAuthenticated, setIsAuthenticated ] = useState(checkIsAuthenticated());
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, error, status } = useGetMe(isAuthenticated);
  const effectiveStatus = isAuthenticated ? status : `success`;

  const login = useCallback(async (form: LoginDTO, referrer?: string) => {
    await AuthService.login(form);
    setIsAuthenticated(true);
    await queryClient.invalidateQueries({ queryKey: [ `user` ] });

    if (referrer) {
      await navigate(referrer);
    }
  }, [ navigate, queryClient ]);

  const logout = useCallback(async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    queryClient.clear();
  }, [ queryClient ]);

  const value = useMemo(() => ({ login, logout, user }), [ login, logout, user ]);

  return <AsyncPageWrapper status={effectiveStatus} error={error || undefined}>
    <AuthContext.Provider value={value} {...props} />
  </AsyncPageWrapper>;
};
