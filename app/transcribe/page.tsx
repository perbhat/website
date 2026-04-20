import { createClient } from "@/lib/supabase/server";
import SignIn from "./sign-in";
import TranscribeClient from "./transcribe-client";

export default async function TranscribePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <SignIn />;
  }

  return <TranscribeClient userEmail={user.email ?? ""} />;
}
