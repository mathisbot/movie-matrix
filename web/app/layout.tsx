import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
 
const roboto = Roboto({
    weight: '700',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: "MovieMatrix",
    description: "Helps you choosing your next movie to watch!",
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={roboto.className}>
                {/* <header className="bg-white p-4 flex justify-between items-center">
                    <div className="flex flex-row items-center">
                        <Link href="/" className="text-2xl font-bold mr-5">
                            MovieMatrix
                        </Link>
                        <p className="mr-1">By</p>
                        <Link
                            className="flex place-items-center gap-2 lg:pointer-events-auto lg:p-0"
                            href="https://viarezo.fr"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/viarezo.svg"
                                alt="ViaRézo Logo"
                                className="dark:invert"
                                width={60}
                                height={60}
                                priority
                            />
                        </Link>
                    </div>
                    <nav>
                        <Link href="/movies" className="ml-4">
                            Movies
                        </Link>
                    </nav>
                </header> */}
                {children}
            </body>
        </html>
    );
}
