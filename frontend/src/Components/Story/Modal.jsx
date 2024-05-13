import React from "react";
import "./Modal.css";

const Modal = ({ children, closeModal }) => {
  return (
    <div className="modal__overlay" onClick={closeModal}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        {children}
        <div className="modal__close__wrapper">
          <button className="modal__close" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
