import { revalidatePath } from "next/cache";
import { logout } from "../action";
import { redirect } from "next/navigation";

export async function GET() {
    await logout();
    // TODO: Currently need a user action (manually reload page) to revalidate the cache
    revalidatePath("/", "page");
    redirect("/login");
}
