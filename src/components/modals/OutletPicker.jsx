import { useEffect, useRef } from "react";

import { outlets } from "../../data/outlets.js";
import { useScrollLock } from "../../hooks/useSmoothScroll.js";
import {
  closeOutletPicker,
  orderFromOutlet,
  useOutletPicker,
} from "../../utils/whatsapp.js";

/*=============== OUTLET PICKER ===============*/
/* Opens after any Buy button: the customer picks the outlet to order from,
   then WhatsApp opens for that outlet with the outlet named in the message */
const OutletPicker = () => {
  const request = useOutletPicker();
  const dialogRef = useRef(null);
  const isOpen = Boolean(request);

  useScrollLock(isOpen);

  /* Esc closes; focus moves into the dialog and back to the Buy button */
  useEffect(() => {
    if (!isOpen) return;

    const opener = document.activeElement;
    const onKey = (event) => event.key === "Escape" && closeOutletPicker();

    dialogRef.current?.querySelector("button")?.focus();
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [isOpen]);

  if (!request) return null;

  const { cake } = request;

  return (
    <div
      className="outlet_picker-overlay"
      onClick={(event) => event.target === event.currentTarget && closeOutletPicker()}
    >
      <div
        ref={dialogRef}
        className="outlet_picker"
        role="dialog"
        aria-modal="true"
        aria-labelledby="outlet-picker-title"
        data-lenis-prevent
      >
        <button
          type="button"
          className="outlet_picker-close"
          aria-label="Close"
          onClick={closeOutletPicker}
        >
          <i className="ri-close-line"></i>
        </button>

        <div className="outlet_picker-head">
          {cake?.image && <img src={cake.image} alt="" />}
          <div>
            <h2 id="outlet-picker-title">Choose your outlet</h2>
            <p>
              Where would you like to buy <strong>{cake?.name}</strong>?
            </p>
          </div>
        </div>

        <ul className="outlet_picker-list">
          {outlets.map((outlet) => (
            <li key={outlet.id}>
              <button
                type="button"
                className="outlet_picker-option"
                onClick={() => orderFromOutlet(outlet)}
              >
                <i className="ri-store-2-line" aria-hidden="true"></i>
                <span>
                  <strong>{outlet.name}</strong>
                  <small>{outlet.address.join(" ")}</small>
                </span>
                <i className="ri-whatsapp-line outlet_picker-go" aria-hidden="true"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OutletPicker;
