import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import nfLogo from "@/public/netflix-logo.webp";

import Link from "next/link";

export function HeroCards({ loggedIn }: { loggedIn: boolean }) {
  const mainLinkHref = loggedIn ? "/movies" : "/signup";
  const mainLinkLabel = loggedIn ? "Browse Movies" : "Log In";
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      <Card className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage
              alt="Netflix logo"
              src={nfLogo.src}
            />
            <AvatarFallback>NF</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">Netflix</CardTitle>
            <CardDescription>@netflix</CardDescription>
          </div>
        </CardHeader>

        <CardContent>MovieMatrix is threatening!</CardContent>
      </Card>

      <Card className="absolute right-[20px] top-4 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
          <CardTitle className="text-center">Émile Jaffrain</CardTitle>
          <CardDescription className="font-normal text-primary">
            Engineer @ MovieMatrix
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center pb-2">
          <p>
            Hello X! Come check out @moviematrix&apos;s special recommendation
            algorithm! It will make your life easier.
          </p>
        </CardContent>

        <CardFooter>
          <div>
            <a
              rel="noreferrer noopener"
              href="https://github.com/emilejaff"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">Github icon</span>
              <GitHubLogoIcon className="w-5 h-5" />
            </a>
          </div>
        </CardFooter>
      </Card>

      {/* Pricing */}
      <Card className="absolute top-[150px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            Free
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">$0</span>
            <span className="text-muted-foreground"> /month</span>
          </div>

          <CardDescription>MovieMatrix is free. Forever.</CardDescription>
        </CardHeader>

        <CardContent>
          <Link href="/movies">
            <Button className="w-full">Browse movies</Button>
          </Link>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {["Recommendation algorithm", "User ratings", "10k+ movies"].map(
              (benefit: string) => (
                <span key={benefit} className="flex">
                  {/* <Check className="text-green-500" />{" "} */}
                  <h3 className="ml-2">{benefit}</h3>
                </span>
              )
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Service */}
      <Card className="absolute w-[350px] -right-[10px] bottom-[35px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            {/* <LightBulbIcon /> */}
          </div>
          <div>
            <CardTitle>User-based recommendations</CardTitle>
            <CardDescription className="text-md mt-2">
              <Link href={mainLinkHref} className="text-blue-600">
                {mainLinkLabel}
              </Link>{" "}
              and get your own recommendations based on your tastes, your
              ratings and other people&apos;s ratings.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
