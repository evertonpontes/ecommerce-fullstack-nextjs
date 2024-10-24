import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AvatarDropdown from './avatar-dropdown';
import Header from './header';
import { Sidebar } from './sidebar';
import { Search } from 'lucide-react';
import { Input } from './ui/input';

export async function Navbar() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center">
            <Sidebar />
            <Header />
          </div>
          <form className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              className="w-full pl-8 md:w-[200px] lg:w-[336px]"
              placeholder="Search..."
              name="q"
            />
          </form>
          <div className="flex items-center">
            <AvatarDropdown user={session.user} />
          </div>
        </div>
      </div>
    </nav>
  );
}
