import React, { useContext } from 'react';
import { LoginDTO, UserDTO } from 'rsd';

interface IAuthContext {
  login: (data: LoginDTO, referrer?: string) => Promise<void>;
  logout: () => Promise<void>;
  user: UserDTO;
}

export const AuthContext = React.createContext<IAuthContext | undefined>(undefined);
AuthContext.displayName = `AuthContext`;

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
};
