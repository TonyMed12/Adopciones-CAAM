import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function requireBetterAuthEmail() {
    const session = await auth.api.getSession({ headers: await headers() });
    const email = session?.user?.email ?? null;
    if (!email) throw new Error("UNAUTHORIZED");
    return email;
}