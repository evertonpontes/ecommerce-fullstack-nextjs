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
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
