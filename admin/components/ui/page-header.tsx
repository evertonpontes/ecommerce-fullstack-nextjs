import { Button } from './button';
import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="max-w-screen-xl px-8 py-4">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
