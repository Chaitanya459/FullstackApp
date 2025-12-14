import React from 'react';
import { uniqueId } from 'lodash';
import { AxiosError, isAxiosError } from 'axios';
import { cn } from '@/lib/utils';

export const FullPageErrorFallback: React.FC<{
  className?: string;
  errors: Array<Error | AxiosError | undefined>;
}> = ({ className = ``, errors }) =>
  <div
    role="alert"
    className={cn(
      `min-h-screen flex flex-col items-center justify-center text-red-500`,
      className,
    )}
  >
    <p>Uh oh... There's a problem. Try refreshing the app.</p>
    {
      errors?.map((e) => e &&
        <pre
          key={uniqueId()}
          className="text-center whitespace-pre-wrap"
        >
          {isAxiosError(e) ?
            <>
              {e.response?.status}
              {` `}
              -
              {` `}
              {
                e.response?.data?.message || e.response?.data
              }
            </> :
            e.message}
        </pre>)
    }
  </div>;
