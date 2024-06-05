import { getUser } from "@/lib/session";
import { Navbar } from "./navbar";


export async function Header() {
    const user = await getUser();

    return (
        <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
            <div className="container mx-auto h-14 px-4 flex items-center justify-between">
                <Navbar user={user} />
            </div>
        </header>
    )

}