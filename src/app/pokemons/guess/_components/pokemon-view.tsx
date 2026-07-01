"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import PokemonImage from "../../[gen]/_components/pokemon-image";
import { PokemonDetail } from "../../[gen]/actions";

type Props = {
	pokemon: PokemonDetail;
	show: boolean;
};

export default function PokemonView({ pokemon, show }: Props) {
	const controls = useAnimation();
	const isShownRef = useRef(show);

	const getRandomValue = (min: number, max: number) =>
		Math.random() * (max - min) + min;

	const getRandomAnimation = () => {
		const animations = [
			// Bounce animation
			async () => {
				const height = getRandomValue(20, 40);
				const sequence = [
					{ y: 0 },
					{ y: -height },
					{ y: 0 },
					{ y: -height / 2 },
					{ y: 0 }
				];
				for (const pos of sequence) {
					await controls.start({
						...pos,
						transition: { duration: 0.2, ease: "easeInOut" }
					});
				}
			},
			// Pulse animation
			async () => {
				const scale = getRandomValue(1.1, 1.3);
				const sequence = [
					{ scale: 1 },
					{ scale },
					{ scale: 1 },
					{ scale },
					{ scale: 1 }
				];
				for (const pos of sequence) {
					await controls.start({
						...pos,
						transition: { duration: 0.2, ease: "easeInOut" }
					});
				}
			},
			// Wiggle
			async () => {
				const angle = getRandomValue(10, 20);
				const sequence = [
					{ rotate: 0 },
					{ rotate: angle },
					{ rotate: -angle },
					{ rotate: angle },
					{ rotate: 0 }
				];
				for (const pos of sequence) {
					await controls.start({
						...pos,
						transition: { duration: 0.15, ease: "easeInOut" }
					});
				}
			},
			// Floating animation
			async () => {
				const x = getRandomValue(-30, 30);
				const y = getRandomValue(-30, 30);
				const rotate = getRandomValue(-20, 20);
				const shouldAddScale = Math.random() > 0.5;

				const sequence = [
					{ x: 0, y: 0, rotate: 0, scale: 1 },
					{ x, y, rotate, scale: shouldAddScale ? 1.25 : 1 },
					{ x: -x, y: -y, rotate: -rotate, scale: shouldAddScale ? 1.25 : 1 },
					{ x, y, rotate, scale: shouldAddScale ? 1.25 : 1 },
					{ x: 0, y: 0, rotate: 0, scale: 1 }
				];

				for (const pos of sequence) {
					await controls.start({
						...pos,
						transition: { duration: 0.3, ease: "easeInOut" }
					});
				}
			}
		];

		return animations[Math.floor(Math.random() * animations.length)];
	};

	const triggerAnimation = async () => {
		const animation = getRandomAnimation();
		await animation();
	};

	useEffect(() => {
		if (show && !isShownRef.current) {
			triggerAnimation();
		} else if (!show && isShownRef.current) {
			controls.start({ x: 0, y: 0, rotate: 0, scale: 1 });
		}
		isShownRef.current = show;
		// eslint-disable-next-line
	}, [show]);

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
					<motion.div animate={controls} onClick={() => show && triggerAnimation()} className={show ? "cursor-pointer" : ""}>
						<PokemonImage
							pokemonId={pokemon.id}
							alt={show ? pokemon.name : "Pokemon silhouette"}
							className={`w-64 h-64 object-contain transition-all duration-300 ${!show ? "filter brightness-0" : ""}`}
						/>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
