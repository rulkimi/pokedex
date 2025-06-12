import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface GenerationConfig {
	limit: number;
	offset: number;
}

const GENERATION_LIMITS: { [key: number]: GenerationConfig } = {
	1: { limit: 151, offset: 0 }, // Generation 1
	2: { limit: 100, offset: 151 }, // Generation 2
	3: { limit: 135, offset: 251 }, // Generation 3
	4: { limit: 107, offset: 386 }, // Generation 4
	5: { limit: 156, offset: 493 }, // Generation 5
	6: { limit: 72, offset: 649 }, // Generation 6
	7: { limit: 88, offset: 721 }, // Generation 7
	8: { limit: 96, offset: 809 }, // Generation 8
	9: { limit: 120, offset: 905 }, // Generation 9
};

export const getPokemonGen = (id: number): number => {
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
  if (suffix) {
    name = name.slice(0, -2);
    icon = iconMappings[suffix];
  }

  const capitalizedString = name.charAt(0).toUpperCase() + name.slice(1);
  return icon ? `${capitalizedString} ${icon}` : capitalizedString;
}

export const getFirstPokemonId = (gen: number): number => {
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
	grass: 'bg-emerald-500',
	fire: 'bg-red-700',
	water: 'bg-blue-500',
	electric: 'bg-yellow-400',
	bug: 'bg-green-700',
	poison: 'bg-fuchsia-800',
	normal: 'bg-gray-400',
	ice: 'bg-cyan-300',
	ground: 'bg-yellow-900',
	fighting: 'bg-red-700',
	flying: 'bg-indigo-400',
	psychic: 'bg-pink-500',
	rock: 'bg-yellow-600',
	ghost: 'bg-indigo-700',
	dragon: 'bg-indigo-900',
	dark: 'bg-gray-800',
	steel: 'bg-gray-600',
	fairy: 'bg-pink-300'
};

type Type = keyof typeof typeColors;

export const getTypeColor = (pokemonType: Type) => {
	return typeColors[pokemonType] || 'gray-500';
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