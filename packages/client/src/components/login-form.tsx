import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAsync } from '@react-hook/async';
import { LoginDTO } from 'rsd';
import { FormErrorLabel } from './form-error-label';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  password: z.string(),
  username: z.string().email(),
}) satisfies z.ZodType<LoginDTO>;

export const LoginForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<`form`>) => {
  const { formState: { errors }, handleSubmit, register } = useForm<LoginDTO>({
    defaultValues: {
      password: ``,
      username: ``,
    },
    resolver: zodResolver(formSchema),
  });

  const { login } = useAuth();
  const [{ status }, call ] = useAsync((data: LoginDTO) => login(data));

  const onSubmit = async (data: LoginDTO) => {
    await call(data);
  };

  return <form className={cn(`flex flex-col gap-6`, className)} {...props} onSubmit={handleSubmit(onSubmit)}>
    <div className="flex flex-col items-center gap-2 text-center">
      <h1 className="text-2xl font-bold">Login to your account</h1>
      <p className="text-sm text-balance text-muted-foreground">
        Enter your email below to login to your account
      </p>
    </div>
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your username"
          required
          {...register(`username`, {
            required: true,
          })}
        />
        {errors.username && <FormErrorLabel message={errors.username.message} />}
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <a
            href="/forgot-password"
            className="ml-auto text-sm hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Type your Password"
          required
          {...register(`password`, { required: true })}
        />
        {errors.password && <FormErrorLabel message={errors.password.message} />}
      </div>
      {status === `error` &&
        <FormErrorLabel message="Incorrect email address or password" />}
      <Button type="submit" className="w-full" disabled={status === `loading`}>
        {status === `loading` ? <Spinner /> : ``}
        {` `}
        Login
      </Button>
    </div>
  </form>;
};
