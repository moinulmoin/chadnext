"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import useScroll from "@/lib/hooks/use-scroll";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

export function Header() {
	const scrolled = useScroll(50);
	return (
		<header
			className={cn(
				"fixed top-0 w-full",
				scrolled
					? "border-b border-gray-200 bg-white/50 backdrop-blur-x transition-all"
					: "bg-white/0",
				"z-30"
			)}
		>
			<div className="container">
				<div className="flex h-20 items-center justify-between">
					<Link href="/" className="flex items-center font-bold text-2xl">
						<Image
							src="/chad-next.png"
							alt="ChadNext logo"
							width="30"
							height="30"
							className="mr-2 object-contain rounded-sm"
							quality="100"
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
