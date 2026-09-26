import { useToast } from "../../context/ToastContext.jsx";

/*=============== TOAST NOTIFICATIONS ===============*/
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast_container">
      {toasts.map(({ id, title, message, icon }) => (
        <div className="toast" key={id}>
          <div className="toast_icon">
            <i className={icon}></i>
          </div>

          <div className="toast_content">
            <h3 className="toast_title">{title}</h3>
            <p className="toast_message">{message}</p>
          </div>

          <button
            className="toast_close"
            type="button"
            aria-label="Close notification"
            onClick={() => removeToast(id)}
          >
            <i className="ri-close-line"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
