import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';

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
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    );
}
