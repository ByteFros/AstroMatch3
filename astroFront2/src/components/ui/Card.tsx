import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  return <div className="border rounded-lg shadow-md p-4">{children}</div>;
}

export function CardContent({ children }: CardProps) {
  return <div className="p-4">{children}</div>;
}
