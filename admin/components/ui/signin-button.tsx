import { Button, ButtonProps } from '@/components/ui/button';
import { BuiltInProviderType } from 'next-auth/providers';
import React from 'react';
import { signIn } from '@/auth';

interface SignInProps extends ButtonProps {
  provider: BuiltInProviderType;
}

export function SignIn({ provider, children, ...props }: SignInProps) {
  return (
    <form
      action={async () => {
        'use server';
        await signIn(provider, { redirectTo: '/' });
      }}
    >
      <Button type="submit" {...props}>
        {children}
      </Button>
    </form>
  );
}
