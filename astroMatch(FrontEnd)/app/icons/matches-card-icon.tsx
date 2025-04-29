import type React from "react"

interface IconProps {
  size?: number
  className?: string
}

const MatchesCardIcon: React.FC<IconProps> = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cartas de tarot */}
      <rect x="4" y="4" width="12" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="8" y="6" width="12" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M10 10L14 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 8L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 16L18 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="13" r="1" fill="currentColor" />
    </svg>
  )
}

export default MatchesCardIcon
