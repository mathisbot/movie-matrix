import Image from "next/image";
import { getUser } from "@/lib/session";
import { redirect } from "next/navigation";

import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default async function Home() {
    const res = await getUser();
    console.log(res);
    const loggedIn = res !== null;
    let sanitizedUsername = '';
    if (loggedIn) {
        sanitizedUsername = res.username;
    }

    return (
        <>
            <Navbar loggedIn={loggedIn} username={sanitizedUsername}/>
            <Hero loggedIn={loggedIn}/>
            <span id="about" />
            <About />
            <FAQ />
            <Footer />
        </>
    );
}
