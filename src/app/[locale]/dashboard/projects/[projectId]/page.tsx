import { getProjectById } from "../action";
import TabSections from "./tab-sections";

export default async function SingleProject({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);
  return <TabSections project={project} />;
}
