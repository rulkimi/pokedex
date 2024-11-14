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
};

export const arrangeType = (types) => {
  const typesCopy = [...types];
  const normalIndex = typesCopy.indexOf('normal');

  if (normalIndex !== -1) {
    const normalElement = typesCopy.splice(normalIndex, 1)[0];
    typesCopy.push(normalElement);
  };

  return typesCopy;
};

export const formatAndArrangeType = (types) => {
  const newTypes = types.map(item => item.type.name);
  return arrangeType(newTypes);
}

export const getTypeColor = (pokemonType) => {
  switch(pokemonType) {
    case 'grass':
      return 'emerald-500';
    case 'fire':
      return 'red-700';
    case 'water':
      return 'blue-500';
    case 'electric':
      return 'yellow-400';
    case 'bug':
      return 'green-700';
    case 'poison':
      return 'fuchsia-800';
    case 'normal':
      return 'gray-400';
    case 'ice':
      return 'cyan-300';
    case 'ground':
      return 'yellow-900';
    case 'fighting':
      return 'red-700';
    case 'flying':
      return 'indigo-400';
    case 'psychic':
      return 'pink-500';
    case 'rock':
      return 'yellow-600';
    case 'ghost':
      return 'indigo-700';
    case 'dragon':
      return 'indigo-900';
    case 'dark':
      return 'gray-800';
    case 'steel':
      return 'gray-600';
    case 'fairy':
      return 'pink-300';
    default:
      return 'gray-500';
  }
}
