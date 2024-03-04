import React, { useState, useContext } from "react";
import Logo from "../components/logo";
import "../class.css";
import ClassForm from "../components/ClassForm.js";
import { ClassesContext } from "../context/ClassesContext";
import { Link } from "react-router-dom";

function Class() {
  const [className, setClassName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const { classes, addClass } = useContext(ClassesContext);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert new class name to lowercase for case-insensitive comparison
    const newClassNameLower = className.toLowerCase();

    // Check for duplicate class name (case-insensitive)
    const isDuplicate = classes.some(
      (c) => c.className.toLowerCase() === newClassNameLower
    );
    if (isDuplicate) {
      setMessage(`Error: A class with the name '${className}' already exists.`);
      setIsSubmitting(false);
      return;
    }

    try {
      await addClass({ className });
      setMessage(`Class '${className}' created successfully.`);
      setClassName("");
    } catch (error) {
      console.error("Error creating class:", error);
      setMessage("Failed to create class. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to clear the message
  const clearMessage = () => {
    setMessage("");
  };

  return (
    <div className="class-page-container">
      <div className="logo-container">
        <Logo />
      </div>
      <div className="class-form-container">
        <ClassForm
          className={className}
          setClassName={setClassName}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
        />
        <div className="message-wrapper">
          {message && (
            <div className="message-container">
              <p>{message}</p>
              <button className="message-close-btn" onClick={clearMessage}>
                &times;
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="classes-container">
        <h3 className="class-form-h3">Created Classes</h3>
        <div className="cards-container">
          {classes.length > 0 ? (
            classes.map((c, index) => (
              <Link to={`/class/${c.id}`} key={c.id} className="class-card">
                <span>{c.className}</span>
              </Link>
            ))
          ) : (
            <p>No classes created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Class;
