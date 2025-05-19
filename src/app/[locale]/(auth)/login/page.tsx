import { redirect } from "next/navigation";
import AuthForm from "~/components/layout/auth-form";
import { Card } from "~/components/ui/card";
import { getCurrentSession } from "~/lib/server/auth/session";

export default async function Login() {
  const { session } = await getCurrentSession();
  if (session) return redirect("/dashboard");
  return (
    <section>
      <div className="container">
        <div className="flex min-h-[calc(100vh-184px)] items-center justify-center md:min-h-[calc(100vh-160px)]">
          <Card className="w-full max-w-[450px] p-6 shadow-md">
            <h2 className="pb-2 text-center text-3xl font-semibold tracking-tight transition-colors">
              Login
            </h2>
            <AuthForm />
          </Card>
        </div>
      </div>
    </section>
  );
}
