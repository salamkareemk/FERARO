import { useEffect, useId, useRef } from "react";

import { useScrollLock } from "../../hooks/useSmoothScroll.js";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/*=============== ADMIN MODAL ===============*/
/* Accessible dialog: Esc / backdrop closes (unless `isBusy`), focus moves
   inside on open, Tab stays inside, focus returns to the opener on close. */
const AdminModal = ({ title, onClose, isBusy = false, size = "md", children, footer }) => {
  const titleId = useId();
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);

  closeRef.current = isBusy ? () => {} : onClose;

  useScrollLock(true);

  useEffect(() => {
    const opener = document.activeElement;
    const dialog = dialogRef.current;

    (dialog.querySelector("[data-autofocus]") ?? dialog.querySelector(FOCUSABLE))?.focus();

    const onKey = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = [...dialog.querySelectorAll(FOCUSABLE)];

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener("keydown", onKey);

    return () => {
      dialog.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, []);

  return (
    <div
      className="admin_modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && closeRef.current()}
    >
      <div
        ref={dialogRef}
        className={`admin_modal admin_modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="admin_modal-header">
          <h2 className="admin_subtitle" id={titleId}>
            {title}
          </h2>

          <button
            type="button"
            className="admin_icon-button"
            aria-label="Close"
            onClick={() => closeRef.current()}
            disabled={isBusy}
          >
            <i className="ri-close-line"></i>
          </button>
        </header>

        <div className="admin_modal-body" data-lenis-prevent>
          {children}
        </div>

        {footer && <footer className="admin_modal-footer">{footer}</footer>}
      </div>
    </div>
  );
};

export default AdminModal;
