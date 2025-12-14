import React, { useContext } from 'react';
import { ReferralDTO } from '../../../types/people';

export interface IReferralContext {
  autoSaveStatus: `idle` | `saving` | `saved` | `error`;
  lastSavedAt: string | null;
  referralData: Partial<ReferralDTO>;
  setAutoSaveStatus: (status: `idle` | `saving` | `saved` | `error`) => void;
  setLastSavedAt: (timestamp: string | null) => void;
  setReferralData: (data: Partial<ReferralDTO>) => void;
}

export const ReferralContext = React.createContext<IReferralContext | undefined>(undefined);

export const useReferralContext = (): IReferralContext => {
  const context = useContext(ReferralContext);
  if (!context) {
    throw new Error(`useReferralContext must be used within a ReferralProvider`);
  }
  return context;
};
