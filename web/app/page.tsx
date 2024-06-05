import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { FAQ } from "@/components/landing/faq";
import { cookies } from "next/headers";
import { getUser } from "@/lib/session";

export default async function Home() {
    let res = null;
    try {
        res = await getUser();
    }
    catch {
        cookies().delete("sessionToken");
    }
    const loggedIn = res !== null;
    const sanitizedUsername = res !== null ? res.username : "";

    return (
        <div className="overflow-hidden min-w-screen">
            <Hero loggedIn={loggedIn}/>
            <span id="about" />
            <About />
            <FAQ />
        </div>
    );
}
