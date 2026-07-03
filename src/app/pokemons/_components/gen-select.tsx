"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function GenSelect() {
	const [selectedGen, setSelectedGen] = useState<number>(1);
  const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const gen = Number(pathname.split('/').at(-2));
		if (!isNaN(gen)) {
			setSelectedGen(gen);
		}
	}, [pathname]);

	const handleChange = (value: string) => {
		const gen = Number(value);
		setSelectedGen(gen);
    startTransition(() => {
		  router.push(`/pokemons/${gen}/0`);
    });
	};

	return (
		<Select
      value={selectedGen.toString()}
      onValueChange={handleChange}
      disabled={isPending}
    >
			<SelectTrigger 
        className="w-full relative" 
        icon={isPending ? <Loader2 className="size-4 animate-spin opacity-50" /> : undefined}
      >
				<SelectValue placeholder="Select gen" />
			</SelectTrigger>
			<SelectContent>
				{Array.from({ length: 10 }, (_, i) => i + 1).map((gen) => (
					<SelectItem key={gen} value={gen.toString()}>
						{gen === 10 ? "Variants" : `Gen ${gen}`}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
