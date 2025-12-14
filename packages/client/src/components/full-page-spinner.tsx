import React from 'react';
import { Spinner } from '@/components/ui/spinner';

export const FullPageSpinner: React.FC = () =>
  <div className="flex min-h-screen items-center justify-center">
    <Spinner className="size-30" />
  </div>;
