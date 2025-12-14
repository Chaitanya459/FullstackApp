import React, { ReactNode } from 'react';
import { AsyncStatus } from '@react-hook/async';
import { AxiosError } from 'axios';
import { QueryStatus } from '@tanstack/react-query';
import { FullPageSpinner } from './full-page-spinner';
import { FullPageErrorFallback } from './full-page-error-fallback';

export const AsyncPageWrapper: React.FC<
{ children: ReactNode, error?: Error, status: AsyncStatus | QueryStatus } |
{ children: ReactNode, error: Array<Error | undefined>, status: Array<AsyncStatus | QueryStatus> }
> = ({ children, error, status }) => {
  if (Array.isArray(status)) {
    if (status.includes(`loading`) || status.includes(`idle`) || status.includes(`pending`)) {
      return <FullPageSpinner />;
    } else if (status.includes(`error`)) {
      return <FullPageErrorFallback errors={error as AxiosError[]} />;
    } else if (status.every((s) => s === `success`)) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <>{children}</>;
    }
    throw new Error(`Unhandled status: ${status.join(`, `)}`);
  } else {
    switch (status) {
      case `loading`:
      case `idle`:
      case `pending`:
        return <FullPageSpinner />;
      case `error`:
        return <FullPageErrorFallback errors={[ error as AxiosError ]} />;
      case `success`:
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{children}</>;
      default:
        throw new Error(`Unhandled status: ${status}`);
    }
  }
};
