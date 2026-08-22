import { type HTMLAttributes, type ReactNode } from "react";

type Variant = "surface" | "raised" | "tonal" | "flat";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: Variant;
}

export function Card({
  children,
  variant = "surface",
  className,
  ...rest
}: CardProps) {
  const classes = [
    "gt-card",
    variant !== "surface" ? `gt-card--${variant}` : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}