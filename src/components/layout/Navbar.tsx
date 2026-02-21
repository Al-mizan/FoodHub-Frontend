"use client";

// import { Menu } from "lucide-react";
import logoImage from "../../../public/assets/logoImage.ico";
import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";

// import {
//   Accordion,
// } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
} from "@/components/ui/navigation-menu";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
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
    src: string | StaticImageData;
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
    src: logoImage,
    alt: "logo",
    title: "Khabo",
  },
  // menu = [
  //   {
  //     title: "Address",
  //     url: "/address",
  //   }
  // ],
  auth: authConfig = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Register", url: "/register" },
  },
  className,
}: NavbarProps) => {
  const { isAuthenticated, isPending } = useAuth();

  // Show skeleton until session is resolved
  const showSkeleton = isPending;

  return (
    <section className={cn("sticky top-0 z-50 bg-background py-4", className)}>
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <Image
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
                width={32}
                height={32}
              />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            {/* {isAuthenticated && ( */}
            <div className="flex items-center ml-36">
              <AddressModal />
            </div>
            {/* )} */}
          </div>
          <div className="flex items-center gap-2">
            <CartIcon />
            <ModeToggle />
            {showSkeleton ? (
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
              <Image
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
                width={32}
                height={32}
              />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            <div className="flex items-center gap-2">
              <CartIcon />
              <ModeToggle />
              {showSkeleton ? (
                <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
              ) : isAuthenticated ? (
                <UserMenu />
              ) : (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link href={authConfig.login.url}>{authConfig.login.title}</Link>
                  </Button>
                  {/* <Button asChild size="sm">
                    <Link href={authConfig.signup.url}>{authConfig.signup.title}</Link>
                  </Button> */}
                </>
              )}
              {/* <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <a href={logo.url} className="flex items-center gap-2">
                        <Image
                          src={logo.src}
                          className="max-h-8 dark:invert"
                          alt={logo.alt}
                          width={32}
                          height={32}
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
              </Sheet> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// const renderMobileMenuItem = (item: MenuItem) => {

//   return (
//     <Link key={item.title} href={item.url} className="text-md font-semibold">
//       {item.title}
//     </Link>
//   );
// };


export { Navbar };