// Avatar generation utilities using local data URLs instead of external services

export const generateAvatarDataUrl = (name: string, bgColor = 'E6E6FA', textColor = '800000', size = 40): string => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${bgColor}"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.3em" 
            font-family="Arial, sans-serif" font-size="${size * 0.4}" 
            font-weight="bold" fill="#${textColor}">
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const getStaffAvatar = (name: string): string => {
  return generateAvatarDataUrl(name, 'E6E6FA', '800000');
};

export const getClientAvatar = (name: string): string => {
  return generateAvatarDataUrl(name, 'F8BBD0', '800000');
};

export const getCompanyAvatar = (name: string): string => {
  return generateAvatarDataUrl(name, 'E6E6FA', '800000', 150);
};
