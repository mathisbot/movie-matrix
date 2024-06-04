'use server'

import { UserServiceClient } from "@/services/user"
import { credentials } from "@grpc/grpc-js"
import { userSignUp, userLogIn } from "@/lib/grpc";
import { getUser } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const cPassword = formData.get("c-password") as string;

    if (password !== cPassword) {
        redirect("/signup?error=2")
    }

    let res = null;
    try {
        res = await userSignUp({ username, password }) as {sessionToken: string};
    }
    catch {
        redirect("/signup?error=1");
    }

    const token = res.sessionToken;
    cookies().set("sessionToken", token, {});

    redirect("/movies");
}

export async function login(formData: FormData) {
    console.log(formData.get("username"));
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    let res = null;
    try {
        res = await userLogIn({ username, password }) as {sessionToken: string};
    }
    catch {
        redirect("/login?error=1");
    }
    const token = res.sessionToken;    
    cookies().set("sessionToken", token, {});

    redirect("/movies");
}

export async function logout() {
    cookies().delete("sessionToken");
}
