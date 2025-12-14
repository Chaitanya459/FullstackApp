import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import {
  useDeleteUser,
  useGetUser,
  useRestoreUser,
  useUpdateUser,
} from '@/services/UserService';
import { useGetServiceTypes } from '@/services/ServiceTypeService';
import { useGetServiceTypeGroups } from '@/services/ServiceTypeGroupService';
import { useGetRoles } from '@/services/RoleService';
import { useConfirmation } from '@/contexts/ConfirmationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Can } from '@/providers/AbilityProvider';

interface EditUserFormData {
  firstName: string;
  lastName: string;
}

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const { data: user, error, isLoading } = useGetUser(userId);
  const { data: serviceTypes = [] } = useGetServiceTypes();
  const { data: serviceTypeGroups = [] } = useGetServiceTypeGroups();
  const { data: roles = [] } = useGetRoles();
  const { createConfirmation } = useConfirmation();
  const { isPending: updateUserPending, mutateAsync: updateUser } = useUpdateUser();
  const { isPending: deletePending, mutateAsync: deleteUser } = useDeleteUser();
  const { isPending: restorePending, mutateAsync: restoreUser } = useRestoreUser();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError: setFormError,
  } = useForm<EditUserFormData>();

  const [ selectedDepartments, setSelectedDepartments ] = useState<number[]>([]);
  const [ selectedRoles, setSelectedRoles ] = useState<number[]>([]);
  const [ selectedServices, setSelectedServices ] = useState<number[]>([]);
  const [ showResultDialog, setShowResultDialog ] = useState(false);
  const [ updateResult, setUpdateResult ] = useState<{
    message: string;
    success: boolean;
  } | null>(null);

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
      });

      const userRoles = user.roles?.map((r) => r.id) || [];
      const userDepartments = user.serviceTypeGroups?.map((d) => d.id) || [];
      const userServices = user.serviceTypes?.map((s) => s.id) || [];

      React.startTransition(() => {
        setSelectedRoles(userRoles);
        setSelectedDepartments(userDepartments);
        setSelectedServices(userServices);
      });
    }
  }, [ user, reset ]);

  const handleFormSubmit = async (data: EditUserFormData) => {
    if (!user) {
      return;
    }

    try {
      await updateUser({
        id: userId,
        user: {
          firstName: data.firstName,
          lastName: data.lastName,
          roles: roles.filter((role) => selectedRoles.includes(role.id)),
          serviceTypeGroups: serviceTypeGroups.filter((dept) =>
            selectedDepartments.includes(dept.id)),
          serviceTypes: serviceTypes.filter((service) =>
            selectedServices.includes(service.id)),
        },
      });

      setUpdateResult({
        message: `User information has been successfully updated.`,
        success: true,
      });
      setShowResultDialog(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to update user. Please try again.`;
      setUpdateResult({ message: errorMessage, success: false });
      setShowResultDialog(true);
    }
  };

  const handleToggleStatus = async () => {
    try {
      if (user?.deletedAt) {
        await restoreUser(userId);
      } else {
        await deleteUser(userId);
      }
    } catch (err) {
      setFormError(`root`, {
        message: err instanceof Error ? err.message : `Failed to update user status. Please try again.`,
        type: `manual`,
      });
    }
  };

  const toggleCheckbox = (
    itemId: number,
    selected: number[],
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    setSelected((prev) =>
      prev.includes(itemId) ?
        prev.filter((item) => item !== itemId) :
        [ ...prev, itemId ]);
  };

  const toggleDepartment = (deptId: number) => {
    if (selectedDepartments.includes(deptId)) {
      setSelectedDepartments((prev) => prev.filter((deptIdItem) => deptIdItem !== deptId));
      const servicesToRemove = serviceTypes
        .filter((service) => service.serviceTypeGroupId === deptId)
        .map((service) => service.id);
      setSelectedServices((prev) => prev.filter(
        (serviceId) => !servicesToRemove.includes(serviceId),
      ));
    } else {
      setSelectedDepartments((prev) => [ ...prev, deptId ]);
    }
  };

  const availableServices = serviceTypes.filter(
    (service) => selectedDepartments.includes(service.serviceTypeGroupId),
  );

  if (isLoading) {
    return <div className="mx-auto max-w-4xl p-6">
      <p className="text-gray-600">Loading user...</p>
    </div>;
  }

  if (error) {
    return <div className="mx-auto max-w-4xl p-6">
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <h2 className="mb-2 text-lg font-semibold text-red-800">
            Permission Error
          </h2>
          <p className="mb-4 text-red-700">
            You don't have permission to view or edit this user's information.
          </p>
          <p className="mb-4 text-sm text-red-600">
            Error: {error.message || `403 - Role does not have permission!`}
          </p>
          <Button
            asChild
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <Link to="/users">
              Back to User List
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>;
  }

  if (!user) {
    return <div className="mx-auto max-w-4xl p-6">
      <p className="text-red-600">User not found</p>
    </div>;
  }

  const isActive = !user.deletedAt;

  return <>
    <div className="mx-auto max-w-7/8 p-6">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Card className="overflow-hidden">
          <div
            className={`-mt-6 h-3 ${
              isActive ? `bg-green-600` : `bg-red-600`
            }`}
          />
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {errors.root && <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>}

            <div className="max-w-1/2 space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                disabled
                className="bg-gray-100"
                value={user?.email || ``}
                readOnly
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  type="text"
                  {...register(`firstName`, { required: `First name is required` })}
                />
                <ErrorMessage
                  errors={errors}
                  name="firstName"
                  render={({ message }) => <p className="text-sm text-red-600">{message}</p>}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  type="text"
                  {...register(`lastName`, { required: `Last name is required` })}
                />
                <ErrorMessage
                  errors={errors}
                  name="lastName"
                  render={({ message }) => <p className="text-sm text-red-600">{message}</p>}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Roles</Label>
              <div className="flex flex-wrap gap-4">
                {roles.map((role) =>
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={selectedRoles.includes(role.id)}
                      onCheckedChange={() =>
                        toggleCheckbox(role.id, selectedRoles, setSelectedRoles)}
                    />
                    <Label
                      htmlFor={`role-${role.id}`}
                      className="cursor-pointer font-normal"
                    >
                      {role.name}
                    </Label>
                  </div>)}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <div className="flex flex-wrap gap-4">
                {serviceTypeGroups.map((dept) =>
                  <div key={dept.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dept-${dept.id}`}
                      checked={selectedDepartments.includes(dept.id)}
                      onCheckedChange={() => toggleDepartment(dept.id)}
                    />
                    <Label
                      htmlFor={`dept-${dept.id}`}
                      className="cursor-pointer font-normal"
                    >
                      {dept.name}
                    </Label>
                  </div>)}
              </div>
            </div>

            {selectedDepartments.length > 0 && <div className="space-y-2">
              <Label>Services</Label>
              <p className="text-xs text-gray-500">
                Select the relevant services provided.
              </p>
              <div className="flex flex-wrap gap-4">
                {availableServices.map((service) =>
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() =>
                        toggleCheckbox(
                          service.id,
                          selectedServices,
                          setSelectedServices,
                        )}
                    />
                    <Label
                      htmlFor={`service-${service.id}`}
                      className="cursor-pointer font-normal"
                    >
                      {service.name}
                    </Label>
                  </div>)}
              </div>
            </div>}

            <div className="space-y-3 border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-700">Account History</h3>
              <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium">
                    {format(new Date(user.createdAt), `MMM d, yyyy`)}
                    {user.creator && ` by ${user.creator.name}`}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {format(new Date(user.updatedAt), `MMM d, yyyy`)}
                    {user.updater && ` by ${user.updater.name}`}
                  </p>
                </div>
                {!isActive && user.deletedAt && <div className="space-y-1">
                  <p className="text-gray-500">Deactivated</p>
                  <p className="font-medium">
                    {format(new Date(user.deletedAt), `MMM d, yyyy`)}
                    {user.deletor && ` by ${user.deletor.name}`}
                  </p>
                </div>}
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t pt-6 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  disabled={updateUserPending}
                >
                  {updateUserPending ? `Updating...` : `Update User Info`}
                </Button>
                <Button
                  asChild
                  type="button"
                  variant="outline"
                >
                  <Link to="/users">
                    Cancel
                  </Link>
                </Button>
              </div>

              {isActive ?
                <Can I="DELETE" a="USER">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      createConfirmation({
                        confirmText: `Deactivate`,
                        // eslint-disable-next-line @stylistic/max-len
                        message: `This will deactivate the user's account. They will no longer be able to log in or access the system.`,
                        onConfirm: () => void handleToggleStatus(),
                        title: `Deactivate User Account?`,
                        variant: `destructive`,
                      });
                    }}
                    disabled={deletePending}
                  >
                    {deletePending ? `Deactivating...` : `Deactivate Account`}
                  </Button>
                </Can> :
                <Can I="RESTORE" a="USER">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="bg-green-600 text-white hover:bg-green-700"
                    onClick={() => {
                      createConfirmation({
                        confirmText: `Activate`,
                        message: `This will reactivate the user's account.`,
                        onConfirm: () => void handleToggleStatus(),
                        title: `Activate User Account?`,
                        variant: `default`,
                      });
                    }}
                    disabled={restorePending}
                  >
                    {restorePending ? `Activating...` : `Activate Account`}
                  </Button>
                </Can>}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>

    <AlertDialog open={showResultDialog} onOpenChange={setShowResultDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {updateResult?.success ? `Update Successful` : `Update Failed`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {updateResult?.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setShowResultDialog(false)}>
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>;
};

export default EditUser;
