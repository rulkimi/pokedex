"use client";

import { motion, AnimatePresence } from "framer-motion";
import PokemonImage from "../../[gen]/_components/pokemon-image";
import { PokemonDetail } from "../../[gen]/actions";

type Props = {
	pokemon: PokemonDetail;
	show: boolean;
};

export default function PokemonView({ pokemon, show }: Props) {
	return (
		<div className="flex justify-center">
			<AnimatePresence mode="wait">
				<motion.div
					key={pokemon.id}
					initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
					animate={{
						scale: show ? 1.2 : 1,
						opacity: 1,
						rotate: 0,
						transition: { type: "spring", stiffness: 260, damping: 20 }
					}}
					exit={{
						scale: 0.8,
						opacity: 0,
						rotate: 10,
						transition: { duration: 0.2 }
					}}
				>
					<PokemonImage
						pokemonId={pokemon.id}
						alt={show ? pokemon.name : "Pokemon silhouette"}
						className={`w-64 h-64 object-contain ${!show ? "filter brightness-0" : ""}`}
					/>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
