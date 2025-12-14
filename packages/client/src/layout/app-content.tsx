import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { AnyAbility } from '@casl/ability';
import { ErrorBoundary } from 'react-error-boundary';
import { AxiosError } from 'axios';
import routes from '../routes';
import { FullPageSpinner } from '@/components/full-page-spinner';
import { FullPageErrorFallback } from '@/components/full-page-error-fallback';

const AppContent: React.FC<{ ability: AnyAbility }> = ({ ability }) => {
  const filteredRoutes = routes.filter(
    (route) => route.permission ? ability.can(route.permission.action, route.permission.subject) : true,
  );

  const namedRoutes = filteredRoutes.map((route) => ({
    ...route,
    element: <>
      <title>{route.name ? `${route.name} - RSD` : `RSD`}</title>
      {route.element}
    </>,
  }));

  const RouteList = useRoutes(namedRoutes);

  return <Suspense fallback={<FullPageSpinner />}>
    <ErrorBoundary
      fallbackRender={({ error }: { error: AxiosError }) =>
        <FullPageErrorFallback errors={[ error ]} />}
    >
      {RouteList}
    </ErrorBoundary>
  </Suspense>;
};

export default React.memo(AppContent);
