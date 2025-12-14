import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { type VariantProps } from 'class-variance-authority';
import { toggleVariants } from '../variants/toggleVariants';

import { cn } from '@/lib/utils';

const Toggle = ({
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) =>
  <TogglePrimitive.Root
    data-slot="toggle"
    className={cn(toggleVariants({ className, size, variant }))}
    {...props}
  />;

export { Toggle };
