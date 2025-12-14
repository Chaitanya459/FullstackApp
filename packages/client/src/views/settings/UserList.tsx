import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { UserDTO } from 'rsd';
import { Edit, Mail, User } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useSearchUsers } from '@/services/UserService';
import { Can } from '@/providers/AbilityProvider';
import { useAbility } from '@/contexts/AbilityContext';

const UserList: React.FC = () => {
  const [ nameFilter, setNameFilter ] = useState(``);
  const [ showInactive, setShowInactive ] = useState(false);
  const { data: users = [], isLoading } = useSearchUsers({
    name: nameFilter,
    withDeleted: showInactive,
  });
  const ability = useAbility();

  const columnHelper = createColumnHelper<UserDTO>();

  const columns = useMemo(() => [
    columnHelper.accessor(`name`, {
      cell: ({ getValue }) =>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{getValue()}</span>
        </div>,
      enableSorting: true,
      header: `Name`,
    }),
    columnHelper.accessor(`email`, {
      cell: ({ getValue }) =>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{getValue()}</span>
        </div>,
      enableSorting: true,
      header: `Email`,
    }),
    columnHelper.accessor(`roles`, {
      cell: ({ getValue }) => {
        const roles = getValue() || [];
        return roles.length > 0 ?
          <div className="flex flex-wrap gap-1">
            {roles.map((role) =>
              <Badge key={role.id} variant="outline">{role.name}</Badge>)}
          </div> :
          <span className="text-muted-foreground">N/A</span>;
      },
      enableSorting: false,
      header: `Role`,
    }),
    columnHelper.accessor(`serviceTypeGroups`, {
      cell: ({ getValue }) => {
        const groups = getValue() || [];
        return groups.length > 0 ?
          <div className="flex flex-wrap gap-1">
            {groups.map((g) =>
              <Badge key={g.id} variant="outline">{g.name}</Badge>)}
          </div> :
          <span className="text-muted-foreground">N/A</span>;
      },
      enableSorting: false,
      header: `Departments`,
    }),
    columnHelper.accessor(`serviceTypes`, {
      cell: ({ getValue }) => {
        const serviceTypes = getValue() || [];
        return serviceTypes.length > 0 ?
          <div className="flex flex-wrap gap-1">
            {serviceTypes.map((st) =>
              <Badge key={st.id} variant="secondary">{st.name}</Badge>)}
          </div> :
          <span className="text-muted-foreground">N/A</span>;
      },
      enableSorting: false,
      header: `Services`,
    }),
    columnHelper.accessor(`deletedAt`, {
      cell: ({ getValue }) => {
        const isActive = !getValue();
        return <Badge variant={isActive ? `default` : `secondary`}>
          {isActive ? `Active` : `Inactive`}
        </Badge>;
      },
      enableSorting: false,
      header: `Status`,
    }),
    ...ability.can(`UPDATE`, `USER`) ? [
      columnHelper.accessor(`id`, {
        cell: ({ getValue }) =>
          <div className="flex gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-800"
            >
              <Link to={`/users/${getValue()}`}>
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>,
        enableSorting: false,
        header: `Actions`,
      }),
    ] : [],
  ], [ columnHelper, ability ]);

  return <div className="p-6">
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold">User List</h2>
      <Can I="CREATE" a="USER">
        <Button
          asChild
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Link to="/users/new">
            + Add New User
          </Link>
        </Button>
      </Can>
    </div>

    <div className="mb-4 flex items-center gap-4">
      <Input
        id="user-search"
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
        placeholder="Filter by name..."
        className="max-w-sm"
      />
      <div className="flex items-center space-x-2">
        <Checkbox
          id="show-inactive"
          checked={showInactive}
          onCheckedChange={(checked) => setShowInactive(checked as boolean)}
        />
        <Label
          htmlFor="show-inactive"
          className="cursor-pointer text-sm font-normal"
        >
          Show inactive users
        </Label>
      </div>
    </div>

    <DataTable<UserDTO>
      isLoading={isLoading}
      sortable
      noItemsText="No users found"
      selectable
      sortBy={[{ id: `name`, desc: false }]}
      columns={columns}
      data={users}
      filters={{ name: nameFilter }}
    />
  </div>;
};

export default UserList;
