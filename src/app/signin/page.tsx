import AuthForm from "~/components/layout/auth-form";

export default async function Signin() {
  return (
    <section className=" bg-transparent">
      <div className=" container">
        <div className="flex min-h-[calc(100vh-184px)] items-center justify-center md:min-h-[calc(100vh-160px)]">
          <div className="w-full max-w-[400px]">
            <h2 className="pb-2 text-center text-3xl font-semibold tracking-tight transition-colors">
              Welcome Back 👋
            </h2>
            <AuthForm />
          </div>
        </div>
      </div>
    </section>
  );
}
