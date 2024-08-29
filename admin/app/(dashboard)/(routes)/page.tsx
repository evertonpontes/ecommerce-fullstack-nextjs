import { auth } from '@/auth';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <p>{session?.user?.name}</p>
      <Button>Click me</Button>
    </div>
  );
}
