import { type User } from "lucia";
import { type Metadata } from "next";
import { getPageSession } from "~/lib/auth";
import SettingsForm from "./settings-form";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Settings() {
  const session = await getPageSession();
  return <SettingsForm currentUser={session?.user as User} />;
}
