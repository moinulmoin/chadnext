import { type Metadata } from "next";
import { getCurrentSession } from "~/lib/server/auth/session";
import SettingsForm from "./settings-form";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Settings() {
  const { user } = await getCurrentSession();
  return <SettingsForm currentUser={user!} />;
}
