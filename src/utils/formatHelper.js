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


