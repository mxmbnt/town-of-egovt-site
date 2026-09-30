// Primitives UI réutilisables (Container, boutons, titres, icônes).

export function Container({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-[1290px] px-5 ${className}`}>{children}</div>
}

// Conteneur Bootstrap du thème (listes d'archives) : 1240px sans gouttière sur grand écran
export function NarrowContainer({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-5 xl:px-0 ${className}`}>{children}</div>
}

// Grille d'archive du thème : chaque carte a 30px de marge droite, y compris la dernière
export function ArchiveGrid({ cols = 3, className = '', children }) {
  const c = { 2: 'md:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[cols]
  return <div className={`grid gap-[30px] lg:pr-[30px] ${c} ${className}`}>{children}</div>
}

// Boutons rectangulaires du thème. variants : red | navy | outline | outlineBlue | black
export function Button({ as = 'a', variant = 'red', className = '', children, ...rest }) {
  const Comp = as
  const variants = {
    red: 'bg-accent text-white hover:bg-navy',
    navy: 'bg-navy text-white hover:bg-accent',
    outline: 'border-2 border-line text-ink hover:border-accent hover:bg-accent hover:text-white',
    outlineBlue: 'border-2 border-link text-link hover:bg-link hover:text-white',
    black: 'bg-black text-white hover:bg-sun hover:text-black',
  }
  return (
    <Comp
      href="#"
      className={`inline-flex items-center justify-center font-heading font-medium transition-colors duration-300 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  )
}

export function SectionHeading({ title, text, center = false, className = '' }) {
  return (
    <div className={`${center ? 'text-center' : ''} ${className}`}>
      <h2 className="text-[34px] font-semibold leading-[1.2] sm:text-[40px]">{title}</h2>
      {text && <p className="mt-4 text-[18px]">{text}</p>}
    </div>
  )
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const Icon = {
  chevronDown: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2} {...p}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  chevronRight: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2} {...p}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  ),
  chevronUp: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.4} {...p}>
      <path d="M6 15l6-6 6 6" />
    </svg>
  ),
  arrowRight: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2} {...p}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  ),
  search: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  ),
  external: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.4} {...p}>
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" />
    </svg>
  ),
  comment: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M4 5h16v11H9l-5 4z" />
    </svg>
  ),
  clock: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  mail: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  phone: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.6a1 1 0 01-.25 1z" />
    </svg>
  ),
  play: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  facebook: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h7v-7h-2.5v-3H12V8.8C12 6.3 13.5 5 15.7 5c1 0 2 .1 2.3.2v2.6h-1.6c-1.2 0-1.5.6-1.5 1.5V11h3l-.4 3H15v7h4a2 2 0 002-2V5a2 2 0 00-2-2z" />
    </svg>
  ),
  twitter: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M22 5.9a8.2 8.2 0 01-2.4.66 4.1 4.1 0 001.8-2.27 8.2 8.2 0 01-2.6 1 4.1 4.1 0 00-7 3.74A11.6 11.6 0 013.4 4.75a4.1 4.1 0 001.27 5.47 4 4 0 01-1.86-.51v.05a4.1 4.1 0 003.3 4 4.1 4.1 0 01-1.85.07 4.1 4.1 0 003.83 2.85A8.2 8.2 0 012 18.4a11.6 11.6 0 006.29 1.84c7.55 0 11.67-6.25 11.67-11.67l-.01-.53A8.3 8.3 0 0022 5.9z" />
    </svg>
  ),
  instagram: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.2} {...p}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.8" cy="7.2" r="0.6" fill="currentColor" />
    </svg>
  ),
  youtube: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M21.6 7.2a2.5 2.5 0 00-1.77-1.77C18.27 5 12 5 12 5s-6.27 0-7.83.43A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.77 1.77C5.73 19 12 19 12 19s6.27 0 7.83-.43a2.5 2.5 0 001.77-1.77A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3z" />
    </svg>
  ),
}

export function SocialRound({ light = false, size = 'h-[30px] w-[30px]', networks = ['facebook', 'twitter', 'instagram'] }) {
  return (
    <div className="flex gap-2">
      {networks.map((n) => {
        const I = Icon[n]
        return (
          <a
            key={n}
            href="#"
            aria-label={n}
            className={`grid place-items-center rounded-full transition-colors ${size} ${
              light ? 'bg-white text-navy hover:bg-accent hover:text-white' : 'bg-ink/80 text-white hover:bg-accent'
            }`}
          >
            <I className="h-[14px] w-[14px]" />
          </a>
        )
      })}
    </div>
  )
}
