import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentSession } from "~/lib/server/auth";
import SettingsForm from "./settings-form";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Settings() {
  const result = await getCurrentSession();
  const user = result?.user;
  if (!user) return redirect("/login");

  return (
    <SettingsForm
      currentUser={{
        id: user.id,
        name: user.name ?? "",
        email: user.email ?? "",
        image: user.image ?? "",
      }}
    />
  );
}
