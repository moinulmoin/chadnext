"use client";

import useScroll from "@/lib/hooks/use-scroll";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../shared/theme-toggle";
import { Button } from "../ui/button";

export default function Header() {
	const scrolled = useScroll(50);
	return (
		<header
			className={cn(
				"fixed top-0 w-full",
				scrolled
					? "border-b border-gray-200 h-16 bg-transparent backdrop-blur-xl transition-all"
					: "bg-white/0 h-20",
				"z-30"
			)}
		>
			<div className="container h-full">
				<div className="flex h-full  items-center justify-between">
					<Link href="/" className="flex items-center font-bold text-2xl">
						<Image
							src="/chad-next.png"
							alt="ChadNext logo"
							width="30"
							height="30"
							className="mr-2 object-contain rounded-sm"
						/>
						<p>ChadNext</p>
					</Link>
					<div className=" flex gap-x-2 items-center">
						<ThemeToggle />
						<Button>Sign In</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
