import { forwardRef, useId, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { label, error, hint, className, id, ...rest },
    ref
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const classes = [
      "gt-input",
      error ? "gt-input--error" : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="gt-field">
        {label ? (
          <label className="gt-label" htmlFor={inputId}>
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          ref={ref}
          className={classes}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error || hint ? `${inputId}-help` : undefined
          }
          {...rest}
        />
        {error ? (
          <span id={`${inputId}-help`} className="gt-error-text">
            {error}
          </span>
        ) : hint ? (
          <span id={`${inputId}-help`} className="gt-hint-text">
            {hint}
          </span>
        ) : null}
      </div>
    );
  }
);