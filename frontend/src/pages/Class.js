import React, { useState, useContext } from "react";
import Logo from "../components/logo";
import "../class.css";
import ClassForm from "../components/ClassForm.js";
import { ClassesContext } from "../context/ClassesContext";

function Class() {
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const { classes, addClass } = useContext(ClassesContext); // Destructure classes from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addClass({ className, subject });
      setMessage(
        `Class '${className}' created successfully.`
      );
      setClassName("");
      setSubject("");
    } catch (error) {
      console.error("Error creating class:", error);
      setMessage("Failed to create class. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="logo-container">
        <Logo />
      </div>
      <ClassForm
        className={className}
        setClassName={setClassName}
        subject={subject}
        setSubject={setSubject}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
      />
      {message && <div className="message-container"><p>{message}</p></div>}
      <div>
        <h3 className="class-form-h3">Created Classes</h3>
        {classes.length > 0 ? (
          <ul>
            {classes.map((c, index) => (
              <li key={index}>{`${c.className} - ${c.subject}`}</li>
            ))}
          </ul>
        ) : (
          <p>No classes created yet.</p>
        )}
      </div>
    </div>
  );
}

export default Class;
