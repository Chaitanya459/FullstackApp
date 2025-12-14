import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FullPageSpinner } from '@/components/full-page-spinner';

const AuthenticatedApp = React.lazy(() => import(`./layout/layout`));
const UnauthenticatedApp = React.lazy(() => import(`./layout/unauthenticated-app`));

const App: React.FC = () => {
  const { user } = useAuth();

  return <React.Suspense fallback={<FullPageSpinner />}>
    {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
  </React.Suspense>;
};

export default App;
