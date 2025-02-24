import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "solid";
  size?: "icon" | "default";
}

export function Button({ variant = "solid", size = "default", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded ${
        variant === "outline" ? "border border-gray-500" : "bg-blue-500 text-white"
      } ${size === "icon" ? "p-2 rounded-full" : ""}`}
    />
  );
}
