'use client';

import React, { createContext, useContext, useState } from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card';

interface MultiStepProps extends React.HTMLProps<HTMLDivElement> {
  steps: string[];
}

type MultiStepContextProps = {
  steps: string[];
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

const MultiStepContext = createContext<MultiStepContextProps>(
  {} as MultiStepContextProps
);

export const MultiStep = React.forwardRef<HTMLDivElement, MultiStepProps>(
  ({ steps, children, className, ...props }, ref) => {
    const [currentStep, setCurrentStep] = useState(0);

    return (
      <MultiStepContext.Provider value={{ currentStep, setCurrentStep, steps }}>
        <div ref={ref} className={cn('relative', className)} {...props}>
          {children}
        </div>
      </MultiStepContext.Provider>
    );
  }
);
MultiStep.displayName = 'MultiStep';

const useMultiStep = () => {
  const multiStepContext = useContext(MultiStepContext);

  if (
    !multiStepContext.steps &&
    !multiStepContext.currentStep &&
    !multiStepContext.setCurrentStep
  ) {
    throw new Error('useMultiStep should be used within <MultiStep>');
  }

  return {
    ...multiStepContext,
  };
};

export const MultiStepTriggerNext = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, children, ...props }, ref) => {
  const { currentStep, setCurrentStep, steps } = useMultiStep();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <Button
      ref={ref}
      className={className}
      disabled={currentStep === steps.length - 1}
      onClick={handleNext}
      {...props}
    >
      {children ?? 'Next'}
    </Button>
  );
});
MultiStepTriggerNext.displayName = 'MultiStepTriggerNext';

export const MultiStepTriggerPrevious = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, children, ...props }, ref) => {
  const { currentStep, setCurrentStep, steps } = useMultiStep();

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <Button
      ref={ref}
      className={className}
      disabled={currentStep === 0}
      onClick={handlePrevious}
      {...props}
    >
      {children ?? 'Previous'}
    </Button>
  );
});
MultiStepTriggerPrevious.displayName = 'MultiStepTriggerPrevious';

interface MultiStepContentProps
  extends React.ComponentPropsWithoutRef<typeof CardContent> {
  value: string;
  children?: React.ReactNode;
}

export const MultiStepContent = React.forwardRef<
  React.ElementRef<typeof CardContent>,
  MultiStepContentProps
>(({ value, children, className, ...props }, ref) => {
  const { currentStep, steps } = useMultiStep();

  const getIndex = steps.indexOf(value);

  return (
    <CardContent
      ref={ref}
      className={cn(className, currentStep !== getIndex && 'hidden absolute')}
      {...props}
    >
      <CardHeader>
        <CardTitle className="text-lg">{value}</CardTitle>
      </CardHeader>
      {children}
    </CardContent>
  );
});
MultiStepContent.displayName = 'MultiStepContent';

interface MultiStepNavigationProps
  extends React.ComponentPropsWithoutRef<typeof Card> {
  title: string;
  description: string;
}

export const MultiStepNavigation = React.forwardRef<
  React.ElementRef<typeof Card>,
  MultiStepNavigationProps
>(({ title, description, className, children, ...props }, ref) => {
  const { currentStep, steps } = useMultiStep();

  return (
    <Card
      ref={ref}
      className={cn('flex flex-col space-y-6', className)}
      {...props}
    >
      <MultiStepNavigationHeader
        title={title}
        description={description}
        className="border-b-0 sm:border-b"
      />
      <CardContent className="mx-auto flex-grow ">
        <ul className="flex space-x-8 justify-center sm:flex-col sm:space-x-0 sm:space-y-8 max-w-[200px]">
          {steps.map((step, index) => (
            <li
              key={index}
              className={cn(
                'text-sm flex gap-2 items-center relative',
                currentStep === index
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground'
              )}
            >
              <Circle
                className={cn(
                  'h-4 w-4 flex-shrink-0',
                  currentStep === index
                    ? 'fill-primary stroke-2 stroke-primary'
                    : 'fill-transparent'
                )}
              />
              <span className="sr-only sm:not-sr-only !truncate">{step}</span>
              {index !== steps.length - 1 && (
                <div className="absolute h-px w-px sm:h-8 border-r -bottom-8 left-2" />
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
});
MultiStepNavigation.displayName = 'MultiStepNavigation';

interface MultiStepNavigationHeaderProps
  extends React.ComponentPropsWithoutRef<typeof CardHeader> {
  title: string;
  description: string;
}

const MultiStepNavigationHeader = React.forwardRef<
  React.ElementRef<typeof CardHeader>,
  MultiStepNavigationHeaderProps
>(({ title, description = '', className, ...props }, ref) => {
  return (
    <CardHeader ref={ref} className={className} {...props}>
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardDescription className="text-xs">{description}</CardDescription>
    </CardHeader>
  );
});
MultiStepNavigationHeader.displayName = 'MultiStepNavigationHeader';
