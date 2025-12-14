import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { AlertCircle } from 'lucide-react';
import { UserDTO } from 'rsd';
import { useCreateUser } from '@/services/UserService';
import { useGetServiceTypes } from '@/services/ServiceTypeService';
import { useGetServiceTypeGroups } from '@/services/ServiceTypeGroupService';
import { useGetRoles } from '@/services/RoleService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AddUserFormData {
  email: string;
  firstName: string;
  lastName: string;
}

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const { isPending: createUserPending, mutate: createUser } = useCreateUser();
  const { data: serviceTypes = [] } = useGetServiceTypes();
  const { data: serviceTypeGroups = [] } = useGetServiceTypeGroups();
  const { data: roles = [] } = useGetRoles();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError: setFormError,
  } = useForm<AddUserFormData>({
    defaultValues: {
      email: ``,
      firstName: ``,
      lastName: ``,
    },
  });

  const [ selectedDepartments, setSelectedDepartments ] = useState<number[]>([]);
  const [ selectedRoles, setSelectedRoles ] = useState<number[]>([]);
  const [ selectedServices, setSelectedServices ] = useState<number[]>([]);
  const [ showSuccessDialog, setShowSuccessDialog ] = useState(false);
  const [ createdUserName, setCreatedUserName ] = useState(``);

  const handleFormSubmit = (data: AddUserFormData) => {
    try {
      createUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        roles: roles.filter((role) => selectedRoles.includes(role.id)),
        serviceTypeGroups: serviceTypeGroups.filter((dept) =>
          selectedDepartments.includes(dept.id)),
        serviceTypes: serviceTypes.filter((service) => selectedServices.includes(service.id)),
      } as Omit<UserDTO, `id`>);

      const userName = `${data.firstName} ${data.lastName}`;
      setCreatedUserName(userName);
      setShowSuccessDialog(true);
    } catch (err) {
      const errorMessage = err instanceof Error ?
        err.message :
        `Failed to create user. Please try again.`;
      setFormError(`root`, {
        message: errorMessage,
        type: `manual`,
      });
    }
  };

  const handleAddAnother = () => {
    setShowSuccessDialog(false);
    reset();
    setSelectedDepartments([]);
    setSelectedRoles([]);
    setSelectedServices([]);
  };

  const handleReturnToList = () => {
    setShowSuccessDialog(false);
    void navigate(`/users`);
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

  return <>
    <div className="mx-auto max-w-7/8 p-6">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Card>
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
                {...register(`email`, {
                  pattern: {
                    message: `Please enter a valid email address`,
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  },
                  required: `Email is required`,
                })}
              />
              <ErrorMessage
                errors={errors}
                name="email"
                render={({ message }) => <p className="text-sm text-red-600">{message}</p>}
              />
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

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={createUserPending}
              >
                {createUserPending ? `Creating...` : `Add New User`}
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
          </CardContent>
        </Card>
      </form>
    </div>

    <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>User Created Successfully</AlertDialogTitle>
          <AlertDialogDescription>
            {createdUserName} has been added to the system. Would you like to add another user or
            return to the user list?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleReturnToList}>
            Return to List
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAddAnother}>
            Add Another User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>;
};

export default AddUser;
