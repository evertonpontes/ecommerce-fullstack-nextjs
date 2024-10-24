'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const splitPathname = pathname !== '/' ? pathname.split('/') : [''];
  const lastIndex = splitPathname.length - 1;

  if (splitPathname.length === 3 && splitPathname[lastIndex] !== 'new') {
    splitPathname[lastIndex] = 'edit';
  }

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toLocaleUpperCase() + string.slice(1);
  };

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {splitPathname.length > 1 ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {splitPathname.slice(1, lastIndex).length > 0 && (
              <>
                {splitPathname.slice(1, lastIndex).map((value) => (
                  <BreadcrumbItem key={value}>
                    <BreadcrumbLink href={'/' + value}>
                      {capitalizeFirstLetter(value)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ))}
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>
                {capitalizeFirstLetter(splitPathname[lastIndex])}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          ''
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
