"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useUsuarioAuth() {
  const supabase = createClient();
  const [authId, setAuthId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setAuthId(data.user.id);
    });
  }, []);

  return authId;
}
