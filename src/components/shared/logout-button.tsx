import { LogOutIcon } from "lucide-react";
import { logout } from "~/server/auth";
import { Button } from "../ui/button";

export default function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logout} className={className}>
      <Button type="submit" variant="destructive">
        <LogOutIcon className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </Button>
    </form>
  );
}
