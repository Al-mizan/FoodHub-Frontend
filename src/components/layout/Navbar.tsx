"use client";

import { MapPin, Menu } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Accordion,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "@/components/modules/authentication/UserMenu";
import { CartIcon } from "@/components/modules/homepage/CartIcon";
import { AddressModal } from "@/components/modules/homepage/AddressModal";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "Shadcnblocks.com",
  },
  menu = [
    {
      title: "Address",
      url: "/address",
    }
  ],
  auth: authConfig = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Register", url: "/register" },
  },
  className,
}: NavbarProps) => {
  const { isAuthenticated, isPending } = useAuth();
  
  return (
    <section className={cn("sticky top-0 z-50 bg-background py-4", className)}>
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            {/* {isAuthenticated && ( */}
              <div className="flex items-center ml-30">
                <AddressModal />
              </div>
            {/* )} */}
          </div>
          <div className="flex items-center gap-2">
            <CartIcon />
            <ModeToggle />
            {isPending ? (
              <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
            ) : isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href={authConfig.login.url}>{authConfig.login.title}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={authConfig.signup.url}>{authConfig.signup.title}</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
            </a>
            <div className="flex items-center gap-2">
              <CartIcon />
              {isAuthenticated && <UserMenu />}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <a href={logo.url} className="flex items-center gap-2">
                        <img
                          src={logo.src}
                          className="max-h-8 dark:invert"
                          alt={logo.alt}
                        />
                      </a>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>

                    {isAuthenticated ? (
                      <div className="flex flex-col gap-3">
                        <AddressModal />
                        <ModeToggle />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Button asChild variant="outline">
                          <Link href={authConfig.login.url}>{authConfig.login.title}</Link>
                        </Button>
                        <Button asChild>
                          <Link href={authConfig.signup.url}>{authConfig.signup.title}</Link>
                        </Button>
                        <ModeToggle />
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        asChild
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        <Link href={item.url}>{item.title}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {

  return (
    <Link key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};


export { Navbar };