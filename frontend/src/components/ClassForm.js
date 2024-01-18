import React from 'react';
import '../class.css';

const ClassForm = ({ className, setClassName, subject, setSubject, isSubmitting, handleSubmit }) => {
  return (
    <div className="class-form-container">
      
      <form onSubmit={handleSubmit} className="class-form">
        <input
          id="className"
          name="className"
          type="text"
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="class-form-input"
          required
        />
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="class-form-input"
          required
        />
        <button type="submit" disabled={isSubmitting} className="class-form-button">
          {isSubmitting ? 'Creating...' : 'Add Class'}
        </button>
      </form>
    </div>
  );
};

export default ClassForm;
