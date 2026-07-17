const ICON_KEYS = [
  'food',
  'takeout',
  'dine',
  'snack',
  'transport',
  'metro',
  'bus',
  'taxi',
  'car',
  'fuel',
  'insurance',
  'shopping',
  'fun',
  'daily',
  'home',
  'medical',
  'education',
  'gift',
  'salary',
  'bonus',
  'invest',
  'other',
]

export const CATEGORY_ICON_OPTIONS = ICON_KEYS

function SvgShell({ children, size, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const ICONS = {
  food: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFE8A3" />
      <ellipse cx="16" cy="18" rx="8" ry="5" fill="#F4A261" />
      <path d="M10 14c1.2-3 3.2-4.5 6-4.5S20.8 11 22 14" stroke="#E76F51" strokeWidth="2" strokeLinecap="round" />
      <circle cx="13" cy="17.5" r="1.1" fill="#FFF6D8" />
      <circle cx="17.5" cy="16.8" r="0.9" fill="#FFF6D8" />
    </SvgShell>
  ),
  takeout: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFD6C9" />
      <rect x="9" y="13" width="14" height="10" rx="2.5" fill="#E76F51" />
      <path d="M11 13l2.2-3.2h5.6L21 13" fill="#F4A261" />
      <path d="M13 18h6" stroke="#FFF6D8" strokeWidth="1.6" strokeLinecap="round" />
    </SvgShell>
  ),
  dine: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D8F3DC" />
      <path d="M11 10v10M11 14h3.2M18.5 10v10M18.5 10c2.2 0 3.5 1.4 3.5 3.2S20.7 16.4 18.5 16.4" stroke="#2A9D8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </SvgShell>
  ),
  snack: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFE0F0" />
      <circle cx="16" cy="16" r="7.5" fill="#F72585" />
      <circle cx="13.2" cy="14" r="1.2" fill="#FFE0F0" />
      <circle cx="18.2" cy="17.5" r="1" fill="#FFE0F0" />
      <circle cx="16.5" cy="13.2" r="0.8" fill="#FFE0F0" />
    </SvgShell>
  ),
  transport: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D6EEFF" />
      <rect x="8" y="12" width="16" height="9" rx="2.5" fill="#3D7EA6" />
      <circle cx="11.5" cy="22" r="1.8" fill="#264653" />
      <circle cx="20.5" cy="22" r="1.8" fill="#264653" />
      <rect x="10" y="14" width="4" height="3" rx="0.8" fill="#8ECAE6" />
      <rect x="16" y="14" width="5" height="3" rx="0.8" fill="#8ECAE6" />
    </SvgShell>
  ),
  metro: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#E0E7FF" />
      <rect x="10" y="9" width="12" height="14" rx="3" fill="#4C6EF5" />
      <rect x="12" y="12" width="8" height="5" rx="1.2" fill="#D0D9FF" />
      <circle cx="13.2" cy="20.5" r="1.1" fill="#FFF" />
      <circle cx="18.8" cy="20.5" r="1.1" fill="#FFF" />
    </SvgShell>
  ),
  bus: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D8F3DC" />
      <rect x="8" y="10" width="16" height="11" rx="3" fill="#2A9D8F" />
      <rect x="10" y="12" width="4" height="3.5" rx="0.8" fill="#B7E4C7" />
      <rect x="15" y="12" width="4" height="3.5" rx="0.8" fill="#B7E4C7" />
      <circle cx="11.5" cy="22" r="1.6" fill="#1B4332" />
      <circle cx="20.5" cy="22" r="1.6" fill="#1B4332" />
    </SvgShell>
  ),
  taxi: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFF3BF" />
      <rect x="8" y="13" width="16" height="8" rx="2.5" fill="#F4A261" />
      <rect x="12" y="10.5" width="8" height="3" rx="1" fill="#E9C46A" />
      <circle cx="11.5" cy="22" r="1.6" fill="#264653" />
      <circle cx="20.5" cy="22" r="1.6" fill="#264653" />
      <rect x="10.5" y="14.5" width="4" height="2.5" rx="0.6" fill="#FFE8A3" />
    </SvgShell>
  ),
  car: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFE0D6" />
      <path d="M8 18h16l-1.5-5.2A3 3 0 0 0 19.6 11H12.4a3 3 0 0 0-2.9 1.8L8 18Z" fill="#E76F51" />
      <rect x="11" y="12.5" width="4" height="2.8" rx="0.7" fill="#FFD6C9" />
      <rect x="16.5" y="12.5" width="4" height="2.8" rx="0.7" fill="#FFD6C9" />
      <circle cx="11.2" cy="20.5" r="1.8" fill="#3D3228" />
      <circle cx="20.8" cy="20.5" r="1.8" fill="#3D3228" />
    </SvgShell>
  ),
  fuel: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFE8A3" />
      <rect x="10" y="9" width="9" height="14" rx="2" fill="#E76F51" />
      <rect x="12" y="11" width="5" height="4" rx="1" fill="#FFE8A3" />
      <path d="M19 12h2.5a2 2 0 0 1 2 2v5.5a1.5 1.5 0 0 1-3 0V16" stroke="#C45C3E" strokeWidth="1.8" strokeLinecap="round" />
    </SvgShell>
  ),
  insurance: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D6EEFF" />
      <path d="M16 8.5l7 3.2v5.2c0 4.2-2.9 7.2-7 8.6-4.1-1.4-7-4.4-7-8.6v-5.2L16 8.5Z" fill="#3D7EA6" />
      <path d="M13 16.2l2.1 2.1 4.2-4.2" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </SvgShell>
  ),
  shopping: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFE0F0" />
      <path d="M10 12h12l-1.2 10.2a2 2 0 0 1-2 1.8h-5.6a2 2 0 0 1-2-1.8L10 12Z" fill="#F72585" />
      <path d="M13 12.2V11a3 3 0 0 1 6 0v1.2" stroke="#B5179E" strokeWidth="1.8" strokeLinecap="round" />
    </SvgShell>
  ),
  fun: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#E0E7FF" />
      <circle cx="12" cy="14" r="3.2" fill="#F72585" />
      <circle cx="20" cy="14" r="3.2" fill="#4CC9F0" />
      <circle cx="12" cy="20.5" r="3.2" fill="#E9C46A" />
      <circle cx="20" cy="20.5" r="3.2" fill="#90BE6D" />
    </SvgShell>
  ),
  daily: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#E8F5E9" />
      <rect x="11" y="9" width="10" height="14" rx="2.5" fill="#2A9D8F" />
      <path d="M13.5 13h5M13.5 16.5h5M13.5 20h3.5" stroke="#D8F3DC" strokeWidth="1.6" strokeLinecap="round" />
    </SvgShell>
  ),
  home: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFE8A3" />
      <path d="M16 9l8 7h-2.5v7h-4.2v-4.2h-2.6V23H10.5v-7H8l8-7Z" fill="#E76F51" />
    </SvgShell>
  ),
  medical: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFD6D6" />
      <rect x="14" y="9" width="4" height="14" rx="1.2" fill="#E4572E" />
      <rect x="9" y="14" width="14" height="4" rx="1.2" fill="#E4572E" />
    </SvgShell>
  ),
  education: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D6EEFF" />
      <path d="M6.5 14L16 9.5 25.5 14 16 18.5 6.5 14Z" fill="#3D7EA6" />
      <path d="M10 15.5v4.2c0 .8 2.6 2.3 6 2.3s6-1.5 6-2.3v-4.2" stroke="#264653" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M25.5 14v6" stroke="#264653" strokeWidth="1.6" strokeLinecap="round" />
    </SvgShell>
  ),
  gift: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFE0F0" />
      <rect x="9" y="14" width="14" height="9" rx="2" fill="#F72585" />
      <rect x="9" y="11" width="14" height="4" rx="1.5" fill="#FF8FAB" />
      <path d="M16 11v12M12.5 11c0-2 1.4-3 3.5-1.5C18.1 8 19.5 9 19.5 11" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
    </SvgShell>
  ),
  salary: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D8F3DC" />
      <rect x="9" y="10" width="14" height="12" rx="2.5" fill="#2A9D8F" />
      <circle cx="16" cy="16" r="3.2" fill="#B7E4C7" />
      <path d="M16 13.5v5M14.5 14.8h3M14.5 17.2h3" stroke="#1B4332" strokeWidth="1.2" strokeLinecap="round" />
    </SvgShell>
  ),
  bonus: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFF3BF" />
      <path d="M16 8.5l1.8 4.6 5 .4-3.8 3.2 1.2 4.8L16 19.2l-4.2 2.3 1.2-4.8-3.8-3.2 5-.4L16 8.5Z" fill="#E9C46A" stroke="#C9A227" strokeWidth="1" />
    </SvgShell>
  ),
  invest: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D6EEFF" />
      <path d="M9 21V17l4-4 3 3 6-6" stroke="#3D7EA6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 10h3.5V13.5" stroke="#3D7EA6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </SvgShell>
  ),
  other: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#EDE4D7" />
      <circle cx="11.5" cy="16" r="1.6" fill="#9A8B7A" />
      <circle cx="16" cy="16" r="1.6" fill="#9A8B7A" />
      <circle cx="20.5" cy="16" r="1.6" fill="#9A8B7A" />
    </SvgShell>
  ),
}

export default function CategoryIcon({ name = 'other', size = 28, className = '' }) {
  const render = ICONS[name] || ICONS.other
  return render(size, className)
}
