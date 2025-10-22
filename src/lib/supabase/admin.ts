import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // service key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
