import { revalidatePath } from "next/cache";
import { logout } from "../action";
import { redirect } from "next/navigation";

export async function GET() {
    await logout();
    revalidatePath("/");
    redirect("/");
}
