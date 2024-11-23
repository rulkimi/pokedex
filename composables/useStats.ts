// Format the stat into a readable abbreviation
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

export const getMaxStat = (stat: { stat: { name: string }; base_stat: number }): string => {
  if (stat.stat.name === 'hp') {
    return ((stat.base_stat * 2 + 204)).toFixed(0);
  }
  const maxStat = (stat.base_stat * 2 + 99) * 1.1;
  return maxStat.toFixed(0);
};

export const getStatWidth = (stat: { stat: { name: string }; base_stat: number }): number => {
  const maxStat = Number(getMaxStat(stat));
  return (stat.base_stat / maxStat) * 200;
};

export const formatAndArrangeType = (types: Array<{ type: { name: string } }>): string[] => {
  const newTypes = types.map(item => item.type.name);
  return arrangeType(newTypes);
};

export const getTotalStats = (stats: Array<{ base_stat: number }>): number => {
  return stats.reduce((sum, stat) => sum + stat.base_stat, 0);
};
