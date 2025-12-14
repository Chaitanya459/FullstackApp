import {
  BookMinus,
  Building2,
  HomeIcon,
  LucideIcon,
  NotebookPenIcon,
  UserIcon,
  Users,
} from 'lucide-react';

export interface INavGroup {
  items: INavItem[];
  name?: string;
  permission?: { action: string, subject: string };
}
interface INavItem {
  bottom?: boolean;
  description?: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: INavItem[];
  label: string;
  path: string;
  permission?: { action: string, subject: string };
  public?: boolean;
}

export const navGroups: INavGroup[] = [
  {
    items: [
      {
        description: `View the Overview page.`,
        icon: HomeIcon,
        label: `Overview`,
        path: `/`,
      },
      {
        description: `View the referrals page.`,
        icon: BookMinus,
        label: `Referrals`,
        path: `/referrals`,
      },
      {
        description: `Create a new Note.`,
        icon: NotebookPenIcon,
        label: `New Note`,
        path: `/new-note`,
      },
      {
        description: `View Service Provider Dashboard.`,
        icon: UserIcon,
        label: `Dashboard`,
        path: `/service-provider`,
      },
      {
        description: `View the District List`,
        icon: Building2,
        label: `Districts`,
        path: `/districts`,
      },
    ],
  },
  {
    items: [
      {
        description: `Manage users, roles, and permissions.`,
        icon: Users,
        label: `User List`,
        path: `/users`,
        permission: { action: `READ`, subject: `USER` },
      },
    ],
    name: `Administration`,
    permission: { action: `READ`, subject: `USER` },
  },
];
