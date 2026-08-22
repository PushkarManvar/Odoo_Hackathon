import { type HTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "tertiary" | "neutral" | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: Variant;
}

export function Badge({
  children,
  variant = "neutral",
  className,
  ...rest
}: BadgeProps) {
  const classes = [
    "gt-badge",
    `gt-badge--${variant}`,
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}