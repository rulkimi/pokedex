import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface GenerationConfig {
	limit: number;
	offset: number;
}

export const GENERATION_LIMITS: { [key: number]: GenerationConfig } = {
	1: { limit: 151, offset: 0 }, // Generation 1
	2: { limit: 100, offset: 151 }, // Generation 2
	3: { limit: 135, offset: 251 }, // Generation 3
	4: { limit: 107, offset: 386 }, // Generation 4
	5: { limit: 156, offset: 493 }, // Generation 5
	6: { limit: 72, offset: 649 }, // Generation 6
	7: { limit: 88, offset: 721 }, // Generation 7
	8: { limit: 96, offset: 809 }, // Generation 8
	9: { limit: 120, offset: 905 }, // Generation 9
	10: { limit: 326, offset: 1025 }, // Forms & Variants
};

export const getPokemonGen = (id: number): number => {
	if (id > 10000) return 10;
	for (const [gen, config] of Object.entries(GENERATION_LIMITS)) {
		const { offset, limit } = config;
		if (id > offset && id <= offset + limit) {
			return parseInt(gen);
		}
	}
	return 1; // Default to gen 1 if not found
}


export const formatName = (name: string) => {
  name = name.toLowerCase();
  let icon = '';
  
  const iconMappings: { '-f': string, '-m': string } = {
    '-f': '&#9792;', // Female icon
    '-m': '&#9794;'  // Male icon
  };

  const suffix = Object.keys(iconMappings).find(suffix => name.endsWith(suffix)) as '-f' | '-m' | undefined;
  if (suffix && (name === 'nidoran-f' || name === 'nidoran-m')) {
    name = name.slice(0, -2);
    icon = iconMappings[suffix];
  }

  const formattedString = name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return icon ? `${formattedString} ${icon}` : formattedString;
}

export const getFirstPokemonId = (gen: number): number => {
	if (gen === 10) return 10001;
	return GENERATION_LIMITS[gen].offset + 1;
}


export const getGeneration = (gen: number): GenerationConfig => {
	return GENERATION_LIMITS[gen];
}

export const formatId = (id: number) => {
  return `#${id.toString().padStart(3, '0')}`;
}

export const capitalizeFirstLetter = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

const typeColors: { [key: string]: string } = {
	grass: 'bg-emerald-500 dark:bg-emerald-700',
	fire: 'bg-red-500 dark:bg-red-800',
	water: 'bg-blue-500 dark:bg-blue-700',
	electric: 'bg-yellow-400 dark:bg-yellow-600',
	bug: 'bg-green-600 dark:bg-green-800',
	poison: 'bg-fuchsia-700 dark:bg-fuchsia-900',
	normal: 'bg-gray-400 dark:bg-gray-600',
	ice: 'bg-cyan-400 dark:bg-cyan-700',
	ground: 'bg-yellow-700 dark:bg-yellow-900',
	fighting: 'bg-red-700 dark:bg-red-900',
	flying: 'bg-indigo-400 dark:bg-indigo-700',
	psychic: 'bg-pink-500 dark:bg-pink-800',
	rock: 'bg-yellow-600 dark:bg-yellow-800',
	ghost: 'bg-indigo-600 dark:bg-indigo-800',
	dragon: 'bg-indigo-800 dark:bg-indigo-950',
	dark: 'bg-gray-800 dark:bg-gray-950',
	steel: 'bg-gray-500 dark:bg-gray-700',
	fairy: 'bg-pink-400 dark:bg-pink-700'
};

type Type = keyof typeof typeColors;

export const getTypeColor = (pokemonType: Type) => {
	return typeColors[pokemonType] || 'bg-gray-500 dark:bg-gray-700';
};

export const getPokemonCardBg = (pokemonType: Type, isActive: boolean) => {
	const activeColors: { [key: string]: string } = {
		grass: 'bg-emerald-500/20 dark:bg-emerald-500/10',
		fire: 'bg-red-500/20 dark:bg-red-500/10',
		water: 'bg-blue-500/20 dark:bg-blue-500/10',
		electric: 'bg-yellow-400/20 dark:bg-yellow-400/10',
		bug: 'bg-green-600/20 dark:bg-green-600/10',
		poison: 'bg-fuchsia-700/20 dark:bg-fuchsia-700/10',
		normal: 'bg-gray-400/20 dark:bg-gray-400/10',
		ice: 'bg-cyan-400/20 dark:bg-cyan-400/10',
		ground: 'bg-yellow-700/20 dark:bg-yellow-700/10',
		fighting: 'bg-red-700/20 dark:bg-red-700/10',
		flying: 'bg-indigo-400/20 dark:bg-indigo-400/10',
		psychic: 'bg-pink-500/20 dark:bg-pink-500/10',
		rock: 'bg-yellow-600/20 dark:bg-yellow-600/10',
		ghost: 'bg-indigo-600/20 dark:bg-indigo-600/10',
		dragon: 'bg-indigo-800/20 dark:bg-indigo-800/10',
		dark: 'bg-gray-800/20 dark:bg-gray-800/10',
		steel: 'bg-gray-500/20 dark:bg-gray-500/10',
		fairy: 'bg-pink-400/20 dark:bg-pink-400/10'
	};
	const hoverColors: { [key: string]: string } = {
		grass: 'hover:bg-emerald-500/20 dark:hover:bg-emerald-500/10',
		fire: 'hover:bg-red-500/20 dark:hover:bg-red-500/10',
		water: 'hover:bg-blue-500/20 dark:hover:bg-blue-500/10',
		electric: 'hover:bg-yellow-400/20 dark:hover:bg-yellow-400/10',
		bug: 'hover:bg-green-600/20 dark:hover:bg-green-600/10',
		poison: 'hover:bg-fuchsia-700/20 dark:hover:bg-fuchsia-700/10',
		normal: 'hover:bg-gray-400/20 dark:hover:bg-gray-400/10',
		ice: 'hover:bg-cyan-400/20 dark:hover:bg-cyan-400/10',
		ground: 'hover:bg-yellow-700/20 dark:hover:bg-yellow-700/10',
		fighting: 'hover:bg-red-700/20 dark:hover:bg-red-700/10',
		flying: 'hover:bg-indigo-400/20 dark:hover:bg-indigo-400/10',
		psychic: 'hover:bg-pink-500/20 dark:hover:bg-pink-500/10',
		rock: 'hover:bg-yellow-600/20 dark:hover:bg-yellow-600/10',
		ghost: 'hover:bg-indigo-600/20 dark:hover:bg-indigo-600/10',
		dragon: 'hover:bg-indigo-800/20 dark:hover:bg-indigo-800/10',
		dark: 'hover:bg-gray-800/20 dark:hover:bg-gray-800/10',
		steel: 'hover:bg-gray-500/20 dark:hover:bg-gray-500/10',
		fairy: 'hover:bg-pink-400/20 dark:hover:bg-pink-400/10'
	};
	return isActive ? activeColors[pokemonType] : hoverColors[pokemonType];
};

export const getArrangedTypes = (types: string[]) => {
  const typesCopy = [...types];
  const normalIndex = typesCopy.indexOf('normal');

  if (normalIndex !== -1) {
    const normalElement = typesCopy.splice(normalIndex, 1)[0];
    typesCopy.push(normalElement);
  };

  return typesCopy;
};

export const formatStat = (stat: string): string => {
  switch (stat) {
    case 'hp':
      return 'HP';
    case 'attack':
      return 'ATK';
    case 'defense':
      return 'DEF';
    case 'special-attack':
      return 'SATK';
    case 'special-defense':
      return 'SDEF';
    case 'speed':
      return 'SPD';
    default:
      return 'N/A';
  }
};

export interface Stat {
	name: string;
	value: number;
}

export const getMaxStat = (stat: Stat): string => {
  if (stat.name === 'hp') {
    return ((stat.value * 2 + 204)).toFixed(0);
  }
  const maxStat = (stat.value * 2 + 99) * 1.1;
  return maxStat.toFixed(0);
};

export const getStatWidth = (stat: Stat): number => {
  const maxStat = Number(getMaxStat(stat));
  return (stat.value / maxStat) * 200;
};

export const getTotalStats = (stats: Stat[]): number => {
  return stats.reduce((sum, stat) => sum + stat.value, 0);
};

export const playPokemonCry = (id: number, volume: number = 0.05) => {
	const audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`);
	
	audio.preload = 'auto';
	audio.muted = false;
	audio.volume = volume;
	
	audio.addEventListener('canplaythrough', () => {
		audio.play();
	});
}

export const getPokemonImageUrl = (id: number) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export const getDefaultPokemonImageUrl = (id: number) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export const getHomePokemonImageUrl = (id: number) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
}

export const getShowdownPokemonImageUrl = (id: number) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
}