import React, { FC, ReactNode } from 'react';

interface FormInputProps {
  label: string;
  isInvalid?: boolean;
  children: ReactNode; 
}

export const FormInputGroup: FC<FormInputProps> = ({ label, isInvalid = false, children }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div className="relative"> 
        {children} 
      </div>
      
      {isInvalid && <p className="mt-1 text-sm text-red-500">Este campo es obligatorio.</p>}
    </div>
  );
};