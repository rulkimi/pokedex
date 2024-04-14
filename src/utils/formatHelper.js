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
