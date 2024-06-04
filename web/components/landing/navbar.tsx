'use client'

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RouteProps {
  href: string;
  label: string;
}

export const Navbar = ({loggedIn, username}: {loggedIn: boolean; username: string}) => {
    let routeList: RouteProps[] = [
      {
        href: "#about",
        label: "About",
      },
      {
        href: "/movies",
        label: "Movies",
      },
    ];

    if (loggedIn) {
      routeList.push({
        href: "/profile",
        label: username,
      });
      routeList.push({
        href: "/logout",
        label: "Log Out",
      });
    }
    else {
      routeList.push({
        href: "/signup",
        label: "Sign Up",
      });
      routeList.push({
        href: "/login",
        label: "Log In",
    });
    }

    const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex"
            >
              MovieMatrix
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <Sheet
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <SheetTrigger className="px-2">
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    MovieMatrix
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <Link
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          <nav className="hidden md:flex gap-2 items-center">
            {routeList.map((route: RouteProps, i) => (
              <Link
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className="w-[75px]"
              >
                {/* <Button className="ps-3"> */}
                {route.label}
                {/* </Button> */}
              </Link>
            ))}

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Link
              rel="noreferrer noopener"
              href="https://github.com/mathisbot/movie-matrix"
              target="_blank"
              className="w-[150px] md:w-1/3"
              ><Button className="w-[150px] md:w-1/3">
                 <GitHubLogoIcon className="w-[150px]"></GitHubLogoIcon>
              </Button>
            </Link>
          </div>
          </nav>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
