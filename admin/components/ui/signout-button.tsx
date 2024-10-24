import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { signOut } from '@/auth';

interface SignOutProps extends ButtonProps {}

export function SignOut({ children, ...props }: SignOutProps) {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <Button type="submit" {...props}>
        {children}
      </Button>
    </form>
  );
}
