"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Icons from "../shared/icons";
import LoadingDots from "../shared/loading-dots";

export default function SignInModal() {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!loading) return;
		return () => setLoading(false);
	}, [loading]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Sign In</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[400px]">
				<DialogHeader>
					<DialogTitle>
						<div className="flex items-center">
							<Image
								src="/chad-next.png"
								alt="ChadNext logo"
								width="24"
								height="24"
								className="mr-2 object-contain rounded-sm"
							/>
							<p>ChadNext</p>
						</div>
					</DialogTitle>
				</DialogHeader>
				<div className="py-4">
					<Button
						onClick={() => {
							setLoading(true);
							signIn("github");
						}}
						type="submit"
						className="w-full"
					>
						{loading ? (
							<LoadingDots />
						) : (
							<>
								<Icons.gitHub width={16} className=" mr-2" />
								Sign In With GitHub
							</>
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
