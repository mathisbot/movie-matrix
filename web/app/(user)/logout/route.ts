import { userServiceClient } from "@/lib/grpc";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
    const tokenCookie = cookies().get("sessionToken");

    if (tokenCookie) {
        await userServiceClient.logout({
        sessionToken: tokenCookie.value,
        });

        cookies().delete("sessionToken");
    }

    // TODO: Currently need a user action (manually reload page) to revalidate the cache
    revalidatePath("/", "page");
    redirect("/login");
}
