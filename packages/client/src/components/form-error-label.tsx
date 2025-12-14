import React from 'react';

export const FormErrorLabel: React.FC<{
  message?: string;
}> = ({ message }) => <span className="text-xs text-red-500" role="alert">{message}</span>;
