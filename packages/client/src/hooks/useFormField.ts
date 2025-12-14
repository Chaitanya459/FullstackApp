import { useFormContext } from 'react-hook-form';
import { useContext } from 'react';
import { FormFieldContext } from '@/contexts/FormFieldContext';
import { FormItemContext } from '@/contexts/FormItemContext';

export const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { formState, getFieldState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error(`useFormField should be used within <FormField>`);
  }

  const { id } = itemContext;

  return {
    id,
    formDescriptionId: `${id}-form-item-description`,
    formItemId: `${id}-form-item`,
    formMessageId: `${id}-form-item-message`,
    name: fieldContext.name,
    ...fieldState,
  };
};
