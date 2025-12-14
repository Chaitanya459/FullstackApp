import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from '../variants/buttonVariants';
import { cn } from '@/lib/utils';

const Button = ({
  asChild = false,
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<`button`> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) => {
  const Comp = asChild ? Slot : `button`;

  return <Comp
    data-slot="button"
    className={cn(`cursor-pointer`, buttonVariants({ className, size, variant }))}
    {...props}
  />;
};

export { Button };
