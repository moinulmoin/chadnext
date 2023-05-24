import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Dashboard() {
	const session = await getServerSession();

	if (!session) {
		redirect("/");
	}

	return (
		<div className=" z-10">
			<h1 className=" text-6xl font-bold text-primary">Coming Soon</h1>
		</div>
	);
}

export default Dashboard;
