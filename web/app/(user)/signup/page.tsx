import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { UserSignupForm } from "@/components/user-signup";
import { getUser } from "@/lib/session";

import backgroundImage from "@/public/movie-matrix.webp";

export const metadata: Metadata = {
    title: "Signup | MovieMatrix",
    description: "Authentication forms for MovieMatrix",
};

const errors = [
    "",
    "Username already exists",
    "Passwords do not match",
] as const;

export default async function AuthenticationPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const res = await getUser();
    if (res !== null) {
        redirect("/movies");
    }

    let error = "";
    if (searchParams !== undefined) {
        if (
        searchParams.error !== undefined &&
        typeof searchParams.error === "string"
        )
        error = errors[parseInt(searchParams.error)];
    }

    return (
        <>
        <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
            <Image
                className="absolute inset-0 opacity-100"
                alt="MovieMatrix"
                src={backgroundImage}
                fill={true}
            />
            <div className="relative z-20 flex items-center text-lg font-medium">
                <Link href="/" className="text-2xl font-bold mr-5">
                    MovieMatrix
                </Link>
            </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;We help you make even less effort.!&rdquo;
                        </p>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create an account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your information below to create your account
                        </p>
                        <p className="text-red-700">{error}</p>
                    </div>
                    <UserSignupForm />
                    <p className="px-8 text-center text-sm text-muted-foreground">
                    Already have an account ?{" "}
                    <Link
                        href="/login"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Log In
                    </Link>{" "}
                    instead.
                    </p>
                </div>
            </div>
        </div>
        </>
    );
}
