import type React from "react"

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export default function MatchesCardIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M19 5V19M19 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H19M19 5H21M19 21H21M5 9H7M5 12H7M5 15H7M5 18H7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 10C15.5 11.3807 14.3807 12.5 13 12.5C11.6193 12.5 10.5 11.3807 10.5 10C10.5 8.61929 11.6193 7.5 13 7.5C14.3807 7.5 15.5 8.61929 15.5 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 18.5C17 16.0147 15.2091 14 13 14C10.7909 14 9 16.0147 9 18.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

