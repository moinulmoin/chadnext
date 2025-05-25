import { redirect } from "next/navigation";
import LoginModal from "~/components/layout/login-modal";
import { getCurrentSession } from "~/lib/server/auth";

export default async function Login() {
  const result = await getCurrentSession();
  if (result?.session) return redirect("/dashboard");
  return <LoginModal />;
}
