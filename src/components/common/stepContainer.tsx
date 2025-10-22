import React, { FC, ReactNode } from 'react';

interface StepContainerProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}

/**
 * @component StepContainer
 * @description Provides a standardized layout container for a single step in a multi-step form.
 * Includes a title section, the step content, and a dedicated footer area for navigation.
 * @param {StepContainerProps} props - The component's props.
 * @param {string} props.title - The title of the current step.
 * @param {ReactNode} [props.icon] - Optional icon displayed next to the title.
 * @param {ReactNode} props.children - The main content of the form step.
 * @param {ReactNode} props.footer - Content for the footer section, typically a StepNavigation component.
 */
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