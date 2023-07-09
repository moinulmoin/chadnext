import SignInModal from "~/components/layout/signin-modal";
import { getUser } from "~/server/user";
import type { CurrentUser } from "~/types";
import { redirect } from "next/navigation";

export default async function Signin() {
  const currentUser = (await getUser()) as CurrentUser;
  if (currentUser) redirect("/");

  return <SignInModal />;
}
