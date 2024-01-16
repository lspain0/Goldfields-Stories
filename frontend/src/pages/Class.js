import React, { useState } from 'react';
import Logo from "../components/logo"
import '../index.css';

function Class() {
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ className, subject }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setMessage(`Class '${result.className}' with subject '${result.subject}' created successfully.`);
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
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="className">Class Name:</label> {/* 'htmlFor' in JSX corresponds to 'for' in HTML */}
          <input
            id="className" 
            name="className" 
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="subject">Subject:</label> {/* Associate the label with input using 'htmlFor' */}
          <input
            id="subject" 
            name="subject" 
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Class'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Class;
