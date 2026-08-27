const FLAGS = {
  us: (
    <>
      <rect width="24" height="16" rx="2" fill="#F5F7FA" />
      <g fill="#D6403B">
        {[0, 2, 4, 6, 8, 10, 12].map((y) => (
          <rect key={y} y={y * 1.1428} width="24" height="1.1428" />
        ))}
      </g>
      <rect width="10" height="8.8" rx="1" fill="#1F3E8C" />
    </>
  ),
  de: (
    <>
      <rect width="24" height="16" rx="2" fill="#111" />
      <rect y="5.33" width="24" height="5.33" fill="#D6403B" />
      <rect y="10.66" width="24" height="5.34" fill="#F5C542" />
    </>
  ),
  fr: (
    <>
      <rect width="24" height="16" rx="2" fill="#F5F7FA" />
      <rect width="8" height="16" rx="2" fill="#1F3E8C" />
      <rect x="16" width="8" height="16" rx="2" fill="#D6403B" />
    </>
  ),
}

export function FlagIcon({ code = 'us', className = 'h-4 w-6' }) {
  return (
    <svg viewBox="0 0 24 16" className={className} role="img" aria-label={`${code.toUpperCase()} flag`}>
      {FLAGS[code] ?? FLAGS.us}
    </svg>
  )
}
