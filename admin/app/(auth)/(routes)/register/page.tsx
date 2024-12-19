import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignIn } from '@/components/ui/signin-button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import React from 'react';
import { RegisterForm } from './components/register-form';

export default async function RegisterPage() {
  return (
    <div className="flex flex-col gap-6 text-center">
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Sign up with your Google or GitHub account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 text-start">
            <SignIn
              provider="google"
              variant={'outline'}
              className="gap-4 w-full"
            >
              <FcGoogle className="w-6 h-6" />
              Continue with Google
            </SignIn>
            <SignIn
              provider="github"
              variant={'outline'}
              className="gap-4 w-full"
            >
              <FaGithub className="w-6 h-6" />
              Continue with Github
            </SignIn>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <RegisterForm />
            <div className="text-center text-sm">
              Already have an account?{' '}
              <a href="/login" className="underline underline-offset-4">
                Log in
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
