import React from 'react';
import { Navigate, NonIndexRouteObject } from 'react-router-dom';
import { NoteProvider } from './providers/NoteProvider';

const Home = React.lazy(() => import(`./views/Home`));
const Referrals = React.lazy(() => import(`./views/Referrals/Referrals`));
const NewReferrals = React.lazy(() => import(`./views/Referrals/NewReferral`));
const CreateNote = React.lazy(() => import(`./views/CreateNote`));
const DistrictProfile = React.lazy(() => import(`./views/districts/DistrictProfile`));
const DistrictList = React.lazy(() => import(`./views/districts/DistrictList`));
// eslint-disable-next-line @stylistic/max-len
const ServiceProviderDashboard = React.lazy(() => import(`./views/service-providers/dashboard/ServiceProviderDashboard`));
const ServiceProviderProfile = React.lazy(() => import(`./views/service-providers/profile/ServiceProviderProfile`));
const AddUser = React.lazy(() => import(`./views/settings/AddUser`));
const EditUser = React.lazy(() => import(`./views/settings/EditUser`));
const UserList = React.lazy(() => import(`./views/settings/UserList`));
const StudentProfile = React.lazy(() => import(`./views/students/StudentProfile`));

export interface IRoute extends NonIndexRouteObject {
  name: string;
  path: string;
  permission?: { action: string, subject: string };
}

const routes: IRoute[] = [
  {
    element: <Home />,
    name: `Home`,
    path: `/`,
  },
  {
    element: <Referrals />,
    name: `Referrals`,
    path: `/referrals`,
  },
  {
    element: <NewReferrals />,
    name: `New Referral`,
    path: `/referrals/new`,
  },
  {
    element: <NewReferrals />,
    name: `Edit Referral`,
    path: `/referrals/:id`,
  },
  {
    element: <DistrictList />,
    name: `District List`,
    path: `/districts`,
  },
  {
    element: <DistrictProfile />,
    name: `District Profile`,
    path: `/districts/:id`,
  },
  {
    element: <ServiceProviderDashboard />,
    name: `Dashboard`,
    path: `/service-provider`,
  },
  {
    element: <ServiceProviderProfile />,
    name: `Service Provider Profile`,
    path: `/service-providers/:id`,
  },
  {
    element: <NoteProvider>
      <CreateNote />
    </NoteProvider>,
    name: `New Note`,
    path: `/new-note`,
  },
  {
    element: <StudentProfile />,
    name: `Student Profile`,
    path: `/students/:id`,
    permission: { action: `READ`, subject: `STUDENT` },
  },
  {
    element: <UserList />,
    name: `Users`,
    path: `/users`,
    permission: { action: `READ`, subject: `USER` },
  },
  {
    element: <AddUser />,
    name: `New User`,
    path: `/users/new`,
    permission: { action: `CREATE`, subject: `USER` },
  },
  {
    element: <EditUser />,
    name: `Edit User`,
    path: `/users/:id`,
    permission: { action: `UPDATE`, subject: `USER` },
  },
  {
    element: <StudentProfile />,
    name: `Student Profile`,
    path: `/students/:id`,
  },
  {
    element: <Navigate to="/" replace />,
    name: `Not Found`,
    path: `*`,
  },
];

export default routes;
