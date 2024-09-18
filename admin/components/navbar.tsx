import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Sidebar from './sidebar';
import AvatarDropdown from './avatar-dropdown';

export async function Navbar() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <nav className="bg-primary text-secondary border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Sidebar />
            <div className="text-xl font-bold">Dashboard</div>
          </div>
          <div className="flex items-center">
            <AvatarDropdown user={session.user} />
          </div>
        </div>
      </div>
    </nav>
  );
}
