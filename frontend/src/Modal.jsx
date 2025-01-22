import React from "react";
import "./Modal.css";

const Modal = ({ event,darkMode, closeModal }) => {
  if (!event) return null; 

  return (
    <div className="modal" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{backgroundColor : darkMode ? "black" : "white"}}>
        <h2>{event.summary}</h2>
        <p>{event.description}</p>
        <p>{new Date(event.start.dateTime || event.start.date).toLocaleString()}</p>
        <p>{event.location || "N/A"}</p>
        <p>{event.category}</p>
        <p>{event.description || "No description added"}</p>
        <button onClick={closeModal} className="close-btn" style={{backgroundColor : darkMode ? "white" : "black", color: darkMode ? "black" : "white"}}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
