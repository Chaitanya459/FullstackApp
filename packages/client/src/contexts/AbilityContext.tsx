import { createContext, useContext } from 'react';
import { AnyAbility, PureAbility } from '@casl/ability';

export const AbilityContext = createContext<AnyAbility>(new PureAbility());
AbilityContext.displayName = `AbilityContext`;

export const useAbility = (): AnyAbility => {
  const context = useContext(AbilityContext);
  if (context === undefined) {
    throw new Error(`useAbility must be used within a AbilityProvider`);
  }
  return context;
};
