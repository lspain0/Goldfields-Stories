import React from 'react';

const ClassForm = ({ className, setClassName, subject, setSubject, isSubmitting, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="className">Class Name:</label>
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
        <label htmlFor="subject">Subject:</label>
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
  );
};

export default ClassForm;
