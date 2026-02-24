import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentEmail() {
  const ba = await auth.api.getSession({ headers: await headers() });
  const emailBA = ba?.user?.email;
  if (emailBA) return emailBA;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const emailSB = data?.user?.email ?? null;
  return emailSB;
}