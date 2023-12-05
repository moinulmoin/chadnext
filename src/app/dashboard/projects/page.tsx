import Link from "next/link";
import { Card } from "~/components/ui/card";
import { getProjects } from "./action";
import CreateProjectModal from "./create-project-modal";

export default async function Projects() {
  const projects = await getProjects();

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 ">
      <CreateProjectModal />
      {projects.map((project) => (
        <Card
          role="button"
          key={project.id}
          className="relative flex flex-col items-center justify-center gap-y-2.5 p-8 text-center hover:bg-accent"
        >
          <h4 className="font-medium ">{project.name}</h4>
          <p className=" text-muted-foreground">{`https://${project.domain}`}</p>
          <Link
            href={`/dashboard/projects/${project.id}`}
            className="absolute inset-0 "
          >
            <span className="sr-only">View project details</span>
          </Link>
        </Card>
      ))}
    </div>
  );
}
