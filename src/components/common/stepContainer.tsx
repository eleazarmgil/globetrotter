import React, { FC, ReactNode } from 'react';

interface StepContainerProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}

export const StepContainer: FC<StepContainerProps> = ({ title, icon, children, footer }) => (
  <section className="space-y-6">
    <h2 className="text-2xl font-semibold text-blue-700 flex items-center mb-6 border-b pb-2">
      {icon && <span className="mr-3 h-6 w-6">{icon}</span>}
      {title}
    </h2>
    
    {children}
    
    <div className="pt-6 border-t border-gray-200 mt-8">
      {footer}
    </div>
  </section>
);