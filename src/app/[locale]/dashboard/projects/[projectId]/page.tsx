import { getProjectById } from "../action";
import TabSections from "./tab-sections";

export default async function SingleProject({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;
  const project = await getProjectById(projectId);
  return <TabSections project={project} />;
}
