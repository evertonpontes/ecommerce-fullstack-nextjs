import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Facebook from '@/public/facebook.svg';
import Twitter from '@/public/twitter.svg';
import Instagram from '@/public/instagram.svg';

export function FooterEcommerce() {
  return (
    <footer className="bg-background border-t">
      <div className="container px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">E-commerce Admin</h3>
            <p className="text-sm text-muted-foreground">
              Empowering your e-commerce business with intuitive analytics and
              management tools.
            </p>
          </div>
          <nav className="space-y-3">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {[
                'Dashboard',
                'Categories',
                'Products',
                'Orders',
                'Customers',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Connect with Us</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" asChild>
                <Link href="#" aria-label="Facebook">
                  <div className="w-4 h-4 relative">
                    <Image
                      src={Facebook}
                      alt="facebook-icon"
                      className="object-contain"
                    />
                  </div>
                </Link>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link href="#" aria-label="Twitter">
                  <div className="w-4 h-4 relative">
                    <Image
                      src={Twitter}
                      alt="twitter-icon"
                      className="object-contain"
                    />
                  </div>
                </Link>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link href="#" aria-label="Instagram">
                  <div className="w-4 h-4 relative">
                    <Image
                      src={Instagram}
                      alt="instagram-icon"
                      className="object-contain"
                    />
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 E-commerce Admin. All rights reserved.
          </p>
          <nav>
            <ul className="flex space-x-4">
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
