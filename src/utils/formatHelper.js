export const formatIndex = number => {
  return number.toString().padStart(3, '0');
}

export const formatName = name => {
  name = name.toLowerCase();
  let icon = '';
  
  const iconMappings = {
    '-f': '&#9792;', // Female icon
    '-m': '&#9794;'  // Male icon
  };

  const suffix = Object.keys(iconMappings).find(suffix => name.endsWith(suffix));
  if (suffix) {
    name = name.slice(0, -2);
    icon = iconMappings[suffix];
  }

  const capitalizedString = name.charAt(0).toUpperCase() + name.slice(1);
  return icon ? `${capitalizedString} ${icon}` : capitalizedString;
}

export const formatStat = stat => {
  switch(stat) {
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
}

export const getMaxStat = stat => {
  if (stat.stat.name === 'hp') {
    return (stat.base_stat * 2 + 204).toFixed(0);
  } 
  const maxStat = (stat.base_stat * 2 + 99) * 1.1;
  return maxStat.toFixed(0);
}

export const getStatWidth = stat => {
  return (stat.base_stat / getMaxStat(stat) * 200);
}

export const getTotalStats = stats => {
  let sumStats = 0;
  stats.forEach(stat => {
    sumStats += stat.base_stat;
  });
  
  return sumStats;
}

export const getTypeColor = (pokemonType) => {
  switch(pokemonType) {
    case 'grass':
      return 'bg-emerald-500';
    case 'fire':
      return 'bg-red-700';
    case 'water':
      return 'bg-blue-500';
    case 'electric':
      return 'bg-yellow-400';
    case 'bug':
      return 'bg-green-700';
    case 'poison':
      return 'bg-fuchsia-800';
    case 'normal':
      return 'bg-gray-400';
    case 'ice':
      return 'bg-cyan-300';
    case 'ground':
      return 'bg-yellow-900';
    case 'fighting':
      return 'bg-red-700';
    case 'flying':
      return 'bg-indigo-400';
    case 'psychic':
      return 'bg-pink-500';
    case 'rock':
      return 'bg-yellow-600';
    case 'ghost':
      return 'bg-indigo-700';
    case 'dragon':
      return 'bg-indigo-900';
    case 'dark':
      return 'bg-gray-800';
    case 'steel':
      return 'bg-gray-600';
    case 'fairy':
      return 'bg-pink-300';
    default:
      return 'bg-gray-500';
  }
}
