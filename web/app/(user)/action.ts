"use server";

import { userServiceClient } from "@/lib/grpc";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const cPassword = formData.get("c-password") as string;

  if (password !== cPassword) {
    redirect("/signup?error=2");
  }

  let res = null;
  try {
    res = await userServiceClient.signUp({ username, password });
  } catch {
    redirect("/signup?error=1");
  }

  cookies().set("sessionToken", res.sessionToken);

  redirect("/movies");
}

export async function login(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    let res = null;
    try {
        res = await userServiceClient.login({ username, password });
    } catch {
        redirect("/login?error=1");
    }

    cookies().set("sessionToken", res.sessionToken, {});

    redirect("/movies");
}
