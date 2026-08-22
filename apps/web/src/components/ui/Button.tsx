import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  full?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  full = false,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = [
    "gt-btn",
    `gt-btn--${variant}`,
    `gt-btn--${size}`,
    full ? "gt-btn--full" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...rest}>
      {children}
    </button>
  );
}