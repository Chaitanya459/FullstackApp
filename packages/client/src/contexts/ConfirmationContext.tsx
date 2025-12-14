import React, { createContext, useContext } from 'react';

export interface ConfirmProps {
  cancelText?: string;
  confirmText?: string;
  message?: React.ReactNode;
  onConfirm: (reason?: any) => void;
  reasonComponent?:
  (setReason: React.Dispatch<any>, setReasonProvided: React.Dispatch<boolean>, reason?: any) => React.ReactNode;
  stackedModal?: boolean;
  title: string;
  variant?: `default` | `destructive`;
}

interface IConfirmationContext {
  createConfirmation: (confirmation: ConfirmProps) => void;
}

export const ConfirmationContext = createContext<IConfirmationContext | null>(null);

export const useConfirmation = () => {
  const ctx = useContext(ConfirmationContext);
  if (!ctx) {
    throw new Error(`useConfirmation must be used within a ConfirmationProvider`);
  }
  return ctx;
};
