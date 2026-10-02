import { createPortal } from "react-dom";
import { useEffect } from "react";

import closeIcon from "../../assets/icons/close.svg";
import styles from "./Modal.module.css";

function Modal({ onClose, children, className = "" }) {
  //close when clicked only on overlay
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
  //close when pressing esc key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  //disable scroll when modal is on
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  //rendering modal directly into body instead of wherever components is in the tree
  return createPortal(
    <div className={styles.overlay} onMouseDown={handleOverlayClick}>
      <div
        className={`${styles.panel} ${className}`}
        role="dialog"
        aria-modal="true"
      >
        <button className={styles.close} onClick={onClose} aria-label="Close">
          <img src={closeIcon} alt="" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
