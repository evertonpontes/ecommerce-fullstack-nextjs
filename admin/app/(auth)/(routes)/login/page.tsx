import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

import { SignIn } from '@/components/ui/signin-button';

export default async function LoginPage() {
  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <SignIn provider="google" variant={'outline'} className="gap-4">
        <FcGoogle className="w-6 h-6" />
        SignIn With Google
      </SignIn>
      <SignIn provider="github" className="gap-4">
        <FaGithub className="w-6 h-6" />
        SignIn With GitHub
      </SignIn>
    </div>
  );
}
