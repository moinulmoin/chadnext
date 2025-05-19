import { LogOutIcon } from "lucide-react";
import { logout } from "~/app/[locale]/actions";
import { Button } from "../ui/button";

export default function LogoutButton({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Button
        type="submit"
        onClick={async () => {
          await logout();
        }}
        variant="destructive"
      >
        <LogOutIcon className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </Button>
    </div>
  );
}
