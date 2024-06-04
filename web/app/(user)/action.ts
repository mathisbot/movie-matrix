'use server'

import { UserServiceClient } from "@/services/user"
import { credentials } from "@grpc/grpc-js"
import { userSignUp, userLogIn } from "@/lib/grpc";
import { getUser } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
    console.log(formData.get("username"));
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const cPassword = formData.get("c-password") as string;

    if (password !== cPassword) {
        // TODO: Inform user that passwords do not match
        throw new Error("Passwords do not match")
    }

    const res = await userSignUp({ username, password })

    console.log(res)
}

export async function login(formData: FormData) {
    console.log(formData.get("username"));
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const res = await userLogIn({ username, password }) as {sessionToken: string};

    const token = res.sessionToken;
    
    cookies().set("sessionToken", token, {})

    redirect("/")
}
