import { getServerSession } from "next-auth";
import Navbar from "./navbar";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function Header() {
	const session = await getServerSession(authOptions);
	return <Navbar session={session} />;
}

export default Header;
