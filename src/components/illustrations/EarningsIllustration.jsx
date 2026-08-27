export function EarningsIllustration({ className = 'h-16 w-20' }) {
  return (
    <svg viewBox="0 0 96 76" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="42" cy="70" rx="34" ry="4.5" fill="#0F172A" opacity="0.06" />

      <g fill="#F5C542" stroke="#E0A52E" strokeWidth="1.2">
        <ellipse cx="20" cy="63" rx="9" ry="3.6" />
        <ellipse cx="20" cy="59.5" rx="9" ry="3.6" />
      </g>

      <path
        d="M34 30h26c9 6 14 15 14 24 0 8-6 13-15 13H35c-9 0-15-5-15-13 0-9 5-18 14-24z"
        fill="#5BBF7F"
      />
      <path d="M34 30h26c9 6 14 15 14 24H20c0-9 5-18 14-24z" fill="#7ED39B" />
      <path d="M33 22h28l-6 8H39z" fill="#3E9E63" />
      <path d="M33 22h28l-3 4H36z" fill="#57B87C" />
      <text
        x="47"
        y="56"
        textAnchor="middle"
        fontSize="20"
        fontWeight="800"
        fill="#FFFFFF"
        fontFamily="Inter, sans-serif"
      >
        $
      </text>

      <path
        d="M60 38c6-8 12-13 20-16"
        fill="none"
        stroke="#FF9F43"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path d="M92 18l-4 12-9-7z" fill="#FF9F43" />
      <g fill="#FFB870">
        <rect x="64" y="46" width="5" height="12" rx="2" />
        <rect x="73" y="40" width="5" height="18" rx="2" />
        <rect x="82" y="33" width="5" height="25" rx="2" />
      </g>
    </svg>
  )
}
