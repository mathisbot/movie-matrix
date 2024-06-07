"use client";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
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

export function Navbar({
  user,
}: {
  user: { username: string } | null;
}) {
  const routeList: RouteProps[] = [
    {
      href: "/#about",
      label: "About",
    },
    {
      href: "/movies",
      label: "Movies",
    },
  ];
  const loggedIn = user !== null;

  let authList: RouteProps[] = [];

  if (!loggedIn) {
    authList.push({
      href: "/signup",
      label: "Sign Up",
    });
    authList.push({
      href: "/login",
      label: "Log In",
    });
  }

  return (
    <NavigationMenu className="mx-auto items-center">
      <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
        <NavigationMenuItem className="font-bold flex">
          <a
            rel="noreferrer noopener"
            href="/"
            className="mx-2 font-bold text-xl flex"
          >
            MovieMatrix
          </a>
          <nav className="hidden md:flex gap-2 items-center ml-3">
            {routeList.map((route: RouteProps, i) => (
              <Link
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className="px-2 flex items-center justify-center"
              >
                {/* <Button className="ps-3"> */}
                {route.label}
                {/* </Button> */}
              </Link>
            ))}
          </nav>
        </NavigationMenuItem>

        {/* mobile */}
        <span className="flex md:hidden">
          <Sheet>
            <SheetTrigger className="px-2"></SheetTrigger>

            <SheetContent side={"left"}>
              <SheetHeader>
                <SheetTitle className="font-bold text-xl">
                  MovieMatrix
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                {routeList.map(({ href, label }: RouteProps) => (
                  <Link rel="noreferrer noopener" key={label} href={href}>
                    {label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </span>

        <nav className="hidden md:flex gap-2 items-center">
          {authList.map((route: RouteProps, i) => (
            <Link
              rel="noreferrer noopener"
              href={route.href}
              key={i}
              className="px-2 flex items-center justify-center"
            >
              {route.label}
            </Link>
          ))}

          {loggedIn && (
            <>
              <span>{user.username}</span>
              <Button
                variant="ghost"
                onClick={() => location.assign("/logout")}
              >
                Logout
              </Button>
            </>
          )}

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Link
              rel="noreferrer noopener"
              href="https://github.com/mathisbot/movie-matrix"
              target="_blank"
              className="w-[150px] md:w-1/3"
            >
              <Button className="w-[150px] md:w-1/3">
                <GitHubLogoIcon className="w-[150px]"></GitHubLogoIcon>
              </Button>
            </Link>
          </div>
        </nav>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
