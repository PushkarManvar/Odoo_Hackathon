import {
  useEffect,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const onOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="gt-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Modal"}
      onClick={onOverlayClick}
    >
      <div className="gt-modal">
        {title ? (
          <div className="gt-modal__header">
            <h2 className="gt-modal__title">{title}</h2>
            <button
              type="button"
              className="gt-modal__close"
              aria-label="Close"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
        ) : null}
        <div className="gt-modal__body">{children}</div>
        {footer ? (
          <div className="gt-modal__footer">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}