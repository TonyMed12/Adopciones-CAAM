import { createAuthClient } from "better-auth/react";

export const { signIn, signOut, useSession } = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
}); 