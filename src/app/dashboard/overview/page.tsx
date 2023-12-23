import { Card } from "~/components/ui/card";
import { countAllProjects, countAllUsers } from "./actions";

export default async function Overview() {
  const usersCount = await countAllUsers();
  const projectsCount = await countAllProjects();

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      <Card className="relative flex flex-col items-center justify-center gap-y-2.5 p-8 text-center hover:bg-accent">
        <h4 className="font-medium ">Total Users</h4>
        <p className=" text-muted-foreground">{usersCount}</p>
      </Card>
      <Card className="relative flex flex-col items-center justify-center gap-y-2.5 p-8 text-center hover:bg-accent">
        <h4 className="font-medium ">Total Projects</h4>
        <p className=" text-muted-foreground">{projectsCount}</p>
      </Card>
    </div>
  );
}
