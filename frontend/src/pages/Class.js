import React, { useState, useContext } from 'react'; // Added useContext import
import Logo from "../components/logo";
import '../index.css';
import ClassForm from '../components/ClassForm.js';
import { ClassesContext } from '../context/ClassesContext'; // Import your context

function Class() {
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { classes, addClass } = useContext(ClassesContext); // Destructure classes from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addClass({ className, subject });
      setMessage(`Class '${className}' with subject '${subject}' created successfully.`);
      setClassName('');
      setSubject('');
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
      <h2>Create a New Class</h2>
      <ClassForm
        className={className}
        setClassName={setClassName}
        subject={subject}
        setSubject={setSubject}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
      />
      {message && <p>{message}</p>}
      <div>
        <h3>Created Classes</h3>
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
