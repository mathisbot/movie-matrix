import Image from "next/image";
import { getUser } from "@/lib/session";
import { redirect } from "next/navigation";

import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default async function Home() {
    const username = await getUser();
    // if (username===null) {
    //     redirect("/login");
    // }

    return (
        <>
            <Navbar />
            <Hero />
            <About />
            {/* <HowItWorks />
            <Features />
            <Services />
            <Cta />
            <Testimonials /> */}
            <FAQ />
            <Footer />
        </>
    );
}
