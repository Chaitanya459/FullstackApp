import { ReactNode, useEffect, useState } from 'react';
import { PureAbility } from '@casl/ability';
import { createContextualCan } from '@casl/react';
import { useAuth } from '@/contexts/AuthContext';
import { AbilityContext } from '@/contexts/AbilityContext';

export const AbilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ abilities, setAbilities ] = useState<PureAbility>(new PureAbility());
  const { user } = useAuth();

  useEffect(() => {
    if (user?.permissions) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAbilities(new PureAbility(user?.permissions));
    }
  }, [ user ]);

  return <AbilityContext.Provider value={abilities}>
    {children}
  </AbilityContext.Provider>;
};

export const Can = createContextualCan(AbilityContext.Consumer);
