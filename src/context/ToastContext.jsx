import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

const TOAST_DURATION = 3000;

/*=============== TOAST PROVIDER ===============*/
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (title, message, icon = "ri-check-line") => {
      const id = nextId.current++;

      setToasts((current) => [...current, { id, title, message, icon }]);
      setTimeout(() => removeToast(id), TOAST_DURATION);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
