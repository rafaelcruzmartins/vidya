import { useEffect, useState } from "react";
import "./Toast.css";

const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  return isVisible ? (
    <div className={`toast ${type} animate-in`}>
      <span>{message}</span>
      <button onClick={handleClose} className="close-btn">
        ×
      </button>
    </div>
  ) : null;
};

export default Toast;
