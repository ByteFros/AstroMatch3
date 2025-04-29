import type React from "react"

interface IconProps {
  size?: number
  className?: string
}

const MatchesIcon: React.FC<IconProps> = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Símbolo de Venus y Marte entrelazados - representa compatibilidad */}
      <path
        d="M14.5 9C16.9853 9 19 6.98528 19 4.5C19 2.01472 16.9853 0 14.5 0C12.0147 0 10 2.01472 10 4.5C10 6.98528 12.0147 9 14.5 9Z"
        transform="translate(0, 3)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M10 9V16"
        transform="translate(0, 3)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 13L10 16L13 13"
        transform="translate(0, 3)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 9V16"
        transform="translate(0, 3)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 13L19 16L22 13"
        transform="translate(0, 3)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 9C16.9853 9 19 6.98528 19 4.5C19 2.01472 16.9853 0 14.5 0C12.0147 0 10 2.01472 10 4.5C10 6.98528 12.0147 9 14.5 9Z"
        transform="translate(5, 3)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export default MatchesIcon
