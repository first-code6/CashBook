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
  coffee: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#F7E3C1" />
      <path d="M9 13h12v6.5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V13Z" fill="#B5835A" />
      <path d="M21 15h1.2a2.8 2.8 0 0 1 0 5.6H21" stroke="#8D5B3E" strokeWidth="2" />
      <path d="M12 10c0-1 1-1.2 1-2.2M16 10c0-1 1-1.2 1-2.2" stroke="#8D5B3E" strokeWidth="1.6" strokeLinecap="round" />
    </SvgShell>
  ),
  breakfast: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFF3BF" />
      <path d="M8 18c0-4 3.5-7 8-7s8 3 8 7-3.5 6-8 6-8-2-8-6Z" fill="#FFF" />
      <circle cx="16" cy="17" r="3.5" fill="#F4A261" />
      <path d="M10 10.5h12" stroke="#C58A2B" strokeWidth="2" strokeLinecap="round" />
    </SvgShell>
  ),
  fruit: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D8F3DC" />
      <path d="M16 12c-5-3-8 1-7 6 1 4.5 4 7 7 5.2 3 1.8 6-.7 7-5.2 1-5-2-9-7-6Z" fill="#E85D75" />
      <path d="M16 12c0-3 1.8-5 4.8-5M16.5 10c2.6-1.2 4.7-.5 5.6 1.5" stroke="#2A9D8F" strokeWidth="1.8" strokeLinecap="round" />
    </SvgShell>
  ),
  grocery: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#E8F5E9" />
      <path d="M8 14h16l-2 10H10L8 14Z" fill="#2A9D8F" />
      <path d="M12 14c0-3 1.5-5 4-5s4 2 4 5" stroke="#1B6F64" strokeWidth="2" />
      <path d="M12 17v4M16 17v4M20 17v4" stroke="#B7E4C7" strokeWidth="1.4" strokeLinecap="round" />
    </SvgShell>
  ),
  dessert: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFE0F0" />
      <path d="M9 15h14v8H9v-8Z" fill="#F4A261" />
      <path d="M9 15c2-4 12-4 14 0-2 2-4 0-7 0s-5 2-7 0Z" fill="#FF8FAB" />
      <path d="M16 12V8" stroke="#B5179E" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16" cy="7.5" r="1.7" fill="#E76F51" />
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
  plane: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D6EEFF" />
      <path d="M7.5 17.3 14 15l2.4-7.2c.3-.9 1.1-1.5 2-1.5.7 0 1.2.7 1 1.4L18 14l6.3-1.4c.9-.2 1.7.5 1.5 1.4-.1.5-.5.9-1 1.1L18 18l1.1 6-2.2 1-3-5-3.7 1.4-1.6 2-1.4.2.8-3.3-2.2-2.5 1.7-.5Z" fill="#3D7EA6" />
    </SvgShell>
  ),
  train: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#E0E7FF" />
      <rect x="9" y="7" width="14" height="17" rx="4" fill="#4C6EF5" />
      <rect x="11.5" y="10" width="9" height="6" rx="1.5" fill="#D6EEFF" />
      <circle cx="12.5" cy="20" r="1.3" fill="#FFF" />
      <circle cx="19.5" cy="20" r="1.3" fill="#FFF" />
      <path d="m12 25-2 2m10-2 2 2" stroke="#264653" strokeWidth="1.6" strokeLinecap="round" />
    </SvgShell>
  ),
  bicycle: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D8F3DC" />
      <circle cx="9.5" cy="20" r="4" stroke="#2A9D8F" strokeWidth="1.8" />
      <circle cx="22.5" cy="20" r="4" stroke="#2A9D8F" strokeWidth="1.8" />
      <path d="m9.5 20 4-7h4l5 7m-13 0h7l-3-7m1.5 3h5M13 10h3" stroke="#1B6F64" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </SvgShell>
  ),
  motorcycle: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFE8A3" />
      <circle cx="9.5" cy="21" r="3.5" stroke="#264653" strokeWidth="1.8" />
      <circle cx="23" cy="21" r="3.5" stroke="#264653" strokeWidth="1.8" />
      <path d="M10 21h6l3-6h4m-7 6-4-7h5l3 7M20 12h4" stroke="#E76F51" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </SvgShell>
  ),
  ship: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D6EEFF" />
      <path d="M8 17h16l-2.5 6H11L8 17Z" fill="#3D7EA6" />
      <path d="M12 17V9h8v8M12 12h8" stroke="#264653" strokeWidth="1.7" />
      <path d="M7 25c2-1.5 4-1.5 6 0 2-1.5 4-1.5 6 0 2-1.5 4-1.5 6 0" stroke="#4CC9F0" strokeWidth="1.5" strokeLinecap="round" />
    </SvgShell>
  ),
  travel: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D8F3DC" />
      <rect x="9" y="11" width="14" height="13" rx="3" fill="#2A9D8F" />
      <path d="M13 11V9.5A1.5 1.5 0 0 1 14.5 8h3A1.5 1.5 0 0 1 19 9.5V11M13 14v7M19 14v7" stroke="#1B6F64" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="25" r="1.3" fill="#264653" />
      <circle cx="20" cy="25" r="1.3" fill="#264653" />
    </SvgShell>
  ),
  hotel: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#E0E7FF" />
      <rect x="9" y="8" width="14" height="17" rx="2" fill="#6C63B5" />
      <path d="M13 25v-5h6v5M12 12h2M18 12h2M12 16h2M18 16h2" stroke="#E8E5FF" strokeWidth="1.8" strokeLinecap="round" />
    </SvgShell>
  ),
  parking: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D6EEFF" />
      <rect x="8" y="8" width="16" height="16" rx="4" fill="#3D7EA6" />
      <path d="M13 22V10h4.5a4 4 0 0 1 0 8H13m0-5h4.2a1.5 1.5 0 0 1 0 3H13" stroke="#FFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
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
  repair: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#EDE4D7" />
      <path d="M20.8 8.4a5.3 5.3 0 0 0-6.4 6.5l-6.1 6.2a2.2 2.2 0 1 0 3.1 3.1l6.2-6.1a5.3 5.3 0 0 0 6.5-6.4l-3 3-3-3 2.7-3.3Z" fill="#7A6B5D" />
      <circle cx="10" cy="22.5" r="1" fill="#F7F3EA" />
    </SvgShell>
  ),
  shopping: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFE0F0" />
      <path d="M10 12h12l-1.2 10.2a2 2 0 0 1-2 1.8h-5.6a2 2 0 0 1-2-1.8L10 12Z" fill="#F72585" />
      <path d="M13 12.2V11a3 3 0 0 1 6 0v1.2" stroke="#B5179E" strokeWidth="1.8" strokeLinecap="round" />
    </SvgShell>
  ),
  clothes: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFE0F0" />
      <path d="m11 9 3-1.2c.5 1.4 3.5 1.4 4 0L21 9l4 5-3 2-1.2-1.4V24h-9.6v-9.4L10 16l-3-2 4-5Z" fill="#D95D9B" />
      <path d="M14 8c.5 1.8 3.5 1.8 4 0" stroke="#9D3E72" strokeWidth="1.4" />
    </SvgShell>
  ),
  phone: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D6EEFF" />
      <rect x="10.5" y="7" width="11" height="18" rx="3" fill="#3D7EA6" />
      <rect x="12" y="10" width="8" height="10.5" rx="1" fill="#BDE3F7" />
      <circle cx="16" cy="22.8" r="1" fill="#FFF" />
    </SvgShell>
  ),
  beauty: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFDDEB" />
      <path d="M13 8h6v7h-6z" fill="#F72585" />
      <path d="m14 8 2-2 2 2" fill="#FF8FAB" />
      <rect x="11.5" y="15" width="9" height="4" rx="1.2" fill="#B5179E" />
      <rect x="12.5" y="19" width="7" height="6" rx="1.5" fill="#6D3A75" />
    </SvgShell>
  ),
  haircut: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#E8DFFF" />
      <circle cx="10" cy="11" r="3" fill="none" stroke="#7B5CC7" strokeWidth="2" />
      <circle cx="10" cy="21" r="3" fill="none" stroke="#7B5CC7" strokeWidth="2" />
      <path d="m12.5 12.5 11 8M12.5 19.5l11-8M16 16l7.5-5.5" stroke="#7B5CC7" strokeWidth="1.8" strokeLinecap="round" />
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
  movie: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#E0E7FF" />
      <rect x="8" y="13" width="16" height="11" rx="2" fill="#4C4A78" />
      <path d="M8 13h16l-2-5H10l-2 5Zm3-5 2 5m3-5 2 5m3-5 2 5" stroke="#F4A261" strokeWidth="1.5" />
      <path d="M14 16.5v4l4-2-4-2Z" fill="#FFF" />
    </SvgShell>
  ),
  music: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#E8DFFF" />
      <path d="M14 10v10.2a3.3 3.3 0 1 1-2-3V12l10-2v8.2a3.3 3.3 0 1 1-2-3V8.5L14 10Z" fill="#7B5CC7" />
    </SvgShell>
  ),
  sport: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D8F3DC" />
      <circle cx="16" cy="16" r="9" fill="#FFF" stroke="#2A9D8F" strokeWidth="1.5" />
      <path d="m16 10 3.5 2.5-1.3 4.2h-4.4l-1.3-4.2L16 10Zm-7.8 5 5.6 1.7M23.8 15l-5.6 1.7M12 23l1.8-6.3M20 23l-1.8-6.3" stroke="#2A9D8F" strokeWidth="1.4" strokeLinejoin="round" />
    </SvgShell>
  ),
  game: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#E0E7FF" />
      <path d="M9 13c2-2 12-2 14 0l2 7c.7 2.5-2.2 4.2-4 2.3L18.8 20h-5.6L11 22.3C9.2 24.2 6.3 22.5 7 20l2-7Z" fill="#6C63B5" />
      <path d="M11 16h4m-2-2v4" stroke="#FFF" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="20" cy="15" r="1.2" fill="#F4A261" />
      <circle cx="22.5" cy="17.5" r="1.2" fill="#4CC9F0" />
    </SvgShell>
  ),
  camera: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFF3BF" />
      <path d="M8 12h5l1.5-2h4L20 12h4v11H8V12Z" fill="#4C4A42" />
      <circle cx="16" cy="17.5" r="4" fill="#8ECAE6" stroke="#FFF" strokeWidth="1.5" />
      <circle cx="22" cy="14" r="1" fill="#F4A261" />
    </SvgShell>
  ),
  daily: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#E8F5E9" />
      <rect x="11" y="9" width="10" height="14" rx="2.5" fill="#2A9D8F" />
      <path d="M13.5 13h5M13.5 16.5h5M13.5 20h3.5" stroke="#D8F3DC" strokeWidth="1.6" strokeLinecap="round" />
    </SvgShell>
  ),
  utilities: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#EDE4D7" />
      <path d="M16 8l2 2.5 3.2-.4.5 3.2 2.8 1.7-1.7 2.8.4 3.2-3.2.5L18 24l-2-2.5-3.2.4-.5-3.2L9.5 17l1.7-2.8-.4-3.2 3.2-.5L16 8Z" fill="#7A6B5D" />
      <circle cx="16" cy="16" r="3.5" fill="#F7F3EA" />
    </SvgShell>
  ),
  water: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D6EEFF" />
      <path d="M16 7s7 8 7 12a7 7 0 0 1-14 0c0-4 7-12 7-12Z" fill="#4CC9F0" />
      <path d="M12 20c.5 2 2 3 4 3" stroke="#E8FAFF" strokeWidth="1.6" strokeLinecap="round" />
    </SvgShell>
  ),
  electricity: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFF3BF" />
      <path d="m18 6-9 12h6l-1 8 9-13h-6l1-7Z" fill="#E9C46A" stroke="#C58A2B" strokeWidth="1.2" strokeLinejoin="round" />
    </SvgShell>
  ),
  internet: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#E0E7FF" />
      <path d="M7 13c5-4.5 13-4.5 18 0M10 17c3.5-3 8.5-3 12 0M13.5 21c1.5-1.2 3.5-1.2 5 0" stroke="#4C6EF5" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="16" cy="24" r="1.7" fill="#4C6EF5" />
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
  book: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFF3BF" />
      <path d="M7.5 10.5c3.5-.8 6.2 0 8.5 2.1v12c-2.3-2.1-5-2.9-8.5-2.1v-12Z" fill="#F4A261" />
      <path d="M24.5 10.5c-3.5-.8-6.2 0-8.5 2.1v12c2.3-2.1 5-2.9 8.5-2.1v-12Z" fill="#E9C46A" />
      <path d="M16 12.6v12" stroke="#C58A2B" strokeWidth="1.2" />
    </SvgShell>
  ),
  pet: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#F2E3D5" />
      <circle cx="10.5" cy="12" r="2.3" fill="#9A6B4C" />
      <circle cx="15" cy="9.8" r="2.3" fill="#9A6B4C" />
      <circle cx="20" cy="10.8" r="2.3" fill="#9A6B4C" />
      <circle cx="23" cy="15" r="2.1" fill="#9A6B4C" />
      <path d="M11 21c0-4 2.3-6.5 5.5-6.5S22 17 22 20c0 2.3-1.6 4-3.7 3.3a5.6 5.6 0 0 0-3.6 0C12.6 24 11 23 11 21Z" fill="#9A6B4C" />
    </SvgShell>
  ),
  baby: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFE8A3" />
      <circle cx="16" cy="17" r="8" fill="#FFD3A6" />
      <path d="M14 8c0-2 4-2.5 4.5.2" stroke="#9A6B4C" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="13" cy="16" r="1" fill="#5A4635" />
      <circle cx="19" cy="16" r="1" fill="#5A4635" />
      <path d="M13.5 20c1.4 1.3 3.6 1.3 5 0" stroke="#E76F51" strokeWidth="1.4" strokeLinecap="round" />
    </SvgShell>
  ),
  family: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D8F3DC" />
      <circle cx="11" cy="12" r="3" fill="#2A9D8F" />
      <circle cx="21" cy="12" r="3" fill="#3D7EA6" />
      <circle cx="16" cy="17" r="2.5" fill="#F4A261" />
      <path d="M6.5 23c.5-4 2-6 4.5-6s4 2 4.5 6M16.5 23c.5-4 2-6 4.5-6s4 2 4.5 6M12 25c.3-3 1.6-4.5 4-4.5s3.7 1.5 4 4.5" fill="none" stroke="#264653" strokeWidth="1.6" strokeLinecap="round" />
    </SvgShell>
  ),
  elder: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#F2E3D5" />
      <circle cx="15" cy="10" r="3" fill="#C89F7A" />
      <path d="M12 14c3-1.5 6 0 7 3l1.5 5M14 16l-2 6M19 16l-2 6M22 13v12" stroke="#7A6B5D" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 25h4" stroke="#7A6B5D" strokeWidth="1.8" strokeLinecap="round" />
    </SvgShell>
  ),
  flower: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#E8F5E9" />
      <path d="M16 16v10M16 21c-4 0-6-2-6-5 4 0 6 2 6 5Zm0 2c4 0 6-2 6-5-4 0-6 2-6 5Z" fill="#2A9D8F" />
      <circle cx="16" cy="12" r="3" fill="#E9C46A" />
      <circle cx="16" cy="7.8" r="3" fill="#FF8FAB" />
      <circle cx="20" cy="10.8" r="3" fill="#F72585" />
      <circle cx="12" cy="10.8" r="3" fill="#F4A261" />
      <circle cx="18.5" cy="15.2" r="3" fill="#E76F51" />
      <circle cx="13.5" cy="15.2" r="3" fill="#FF8FAB" />
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
  charity: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFDDE5" />
      <path d="M16 23s-8-4.5-8-10a4.3 4.3 0 0 1 7.7-2.6L16 11l.3-.6A4.3 4.3 0 0 1 24 13c0 5.5-8 10-8 10Z" fill="#E85D75" />
      <path d="M11.5 17.5c2.8 1.7 6.2 1.7 9 0" stroke="#FFF" strokeWidth="1.3" strokeLinecap="round" opacity=".75" />
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
  wallet: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D8F3DC" />
      <rect x="7" y="10" width="18" height="14" rx="3" fill="#2A9D8F" />
      <path d="M9 10V8.5h12V10" stroke="#1B6F64" strokeWidth="1.6" />
      <path d="M18 15h8v5h-8a2.5 2.5 0 0 1 0-5Z" fill="#B7E4C7" />
      <circle cx="20" cy="17.5" r="1" fill="#1B6F64" />
    </SvgShell>
  ),
  bank: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#E0E7FF" />
      <path d="M6.5 13 16 7l9.5 6H6.5ZM8 23h16M10 14v7M14 14v7M18 14v7M22 14v7" stroke="#4C6EF5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </SvgShell>
  ),
  card: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#D6EEFF" />
      <rect x="6.5" y="10" width="19" height="13" rx="3" fill="#3D7EA6" />
      <path d="M7 14h18" stroke="#BDE3F7" strokeWidth="3" />
      <path d="M10 19h5" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
    </SvgShell>
  ),
  work: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#F2E3D5" />
      <rect x="7" y="12" width="18" height="12" rx="3" fill="#9A6B4C" />
      <path d="M12 12V9h8v3M7 17h18M14 17v2h4v-2" stroke="#F7E3C1" strokeWidth="1.7" strokeLinejoin="round" />
    </SvgShell>
  ),
  freelance: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#E8DFFF" />
      <rect x="8" y="8" width="16" height="12" rx="2" fill="#6C63B5" />
      <path d="M5.5 23h21l-2-3h-17l-2 3Z" fill="#4C4A78" />
      <path d="m13 14 2 2 4-5" stroke="#FFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </SvgShell>
  ),
  tax: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFF3BF" />
      <path d="M9 7h14v19l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5V7Z" fill="#FFF" stroke="#C58A2B" strokeWidth="1.3" />
      <circle cx="13" cy="13" r="1.5" fill="#E76F51" />
      <circle cx="19" cy="20" r="1.5" fill="#E76F51" />
      <path d="m12 21 8-10" stroke="#E76F51" strokeWidth="1.8" strokeLinecap="round" />
    </SvgShell>
  ),
  savings: (size, className) => (
    <SvgShell size={size} className={className}>
      <circle cx="16" cy="16" r="14" fill="#FFE0F0" />
      <path d="M8 17c0-5 4-8 9-8 4 0 7 2 8 5l2 1v5h-3c-1 3-4 5-8 5-5 0-8-3-8-8Z" fill="#FF8FAB" />
      <circle cx="20.5" cy="13.5" r="1" fill="#6D3A75" />
      <path d="M12 9c1.5-2 4-2 5.5 0M12 25v2M21 24v3" stroke="#B5179E" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="9" cy="16" r="2" fill="#F72585" />
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

export default function CategoryIcon({ name = 'other', size = 32, className = '' }) {
  const render = ICONS[name] || ICONS.other
  return render(size, className)
}
