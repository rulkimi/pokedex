"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import PokemonImage from "../../[gen]/_components/pokemon-image";
import { PokemonDetail } from "../../[gen]/actions";
import { useSprite } from "../../sprite-provider";

type Props = {
	pokemon: PokemonDetail;
	show: boolean;
};

export default function PokemonView({ pokemon, show }: Props) {
	const controls = useAnimation();
	const isShownRef = useRef(show);
	const { spriteType } = useSprite();

	const getRandomValue = (min: number, max: number) =>
		Math.random() * (max - min) + min;

	const getRandomAnimation = () => {
		const animations = [
			// Joyful Hop
			async () => {
				const height = getRandomValue(30, 45);
				const sequence = [
					{ y: 0, scaleY: 1, scaleX: 1, transition: { duration: 0.05 } },
					{ y: -height, scaleY: 1.05, scaleX: 0.95, transition: { duration: 0.25, ease: "easeOut" } },
					{ y: 0, scaleY: 0.9, scaleX: 1.1, transition: { duration: 0.15, ease: "easeIn" } },
					{ y: -height / 2.5, scaleY: 1.02, scaleX: 0.98, transition: { duration: 0.15, ease: "easeOut" } },
					{ y: 0, scaleY: 1, scaleX: 1, transition: { duration: 0.15, ease: "easeInOut" } }
				];
				for (const pos of sequence) {
					await controls.start(pos);
				}
			},
			// Breathe / Roar
			async () => {
				const scale = getRandomValue(1.15, 1.25);
				const sequence = [
					{ scale: 1 },
					{ scale, transition: { duration: 0.35, ease: "easeOut" } },
					{ scale: 1, transition: { duration: 0.3, ease: "easeInOut" } }
				];
				for (const pos of sequence) {
					await controls.start(pos);
				}
			},
			// Curious Head Tilt
			async () => {
				const angle = getRandomValue(12, 18);
				const sequence = [
					{ rotate: 0 },
					{ rotate: angle, transition: { duration: 0.25, ease: "easeInOut" } },
					{ rotate: -angle * 0.8, transition: { duration: 0.3, ease: "easeInOut" } },
					{ rotate: angle * 0.4, transition: { duration: 0.25, ease: "easeInOut" } },
					{ rotate: 0, transition: { duration: 0.25, ease: "easeInOut" } }
				];
				for (const pos of sequence) {
					await controls.start(pos);
				}
			},
			// Levitating / Drifting
			async () => {
				const x = getRandomValue(-15, 15);
				const y = getRandomValue(-25, -15);
				const rotate = getRandomValue(-8, 8);
				const scale = Math.random() > 0.5 ? 1.1 : 0.95;

				const sequence = [
					{ x: 0, y: 0, rotate: 0, scale: 1 },
					{ x, y, rotate, scale, transition: { duration: 0.5, ease: "easeInOut" } },
					{ x: -x * 0.5, y: y * 0.5, rotate: -rotate * 0.5, scale: 1, transition: { duration: 0.5, ease: "easeInOut" } },
					{ x: 0, y: 0, rotate: 0, scale: 1, transition: { duration: 0.4, ease: "easeInOut" } }
				];

				for (const pos of sequence) {
					await controls.start(pos);
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
		<div className="flex justify-center items-center flex-1 w-full relative z-20 min-h-0">
			<AnimatePresence mode="wait">
				<motion.div
					key={pokemon.id}
					className="w-full h-full flex items-center justify-center"
					initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
					animate={{
						scale: show ? 1.1 : 1,
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
					<motion.div animate={controls} onClick={() => show && triggerAnimation()} className={`w-full h-full flex items-center justify-center ${show ? "cursor-pointer" : ""}`}>
						<PokemonImage
							pokemonId={pokemon.id}
							alt={show ? pokemon.name : "Pokemon silhouette"}
							imageSize={spriteType === "default" ? 350 : 350}
							className={`max-w-full max-h-full w-auto h-auto object-contain transition-all duration-300 ${!show ? "brightness-0" : ""} ${spriteType === "default" || spriteType === "showdown" ? "scale-[1.5] [image-rendering:pixelated]" : "scale-[0.8] -translate-y-2 sm:-translate-y-4"}`}
						/>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
