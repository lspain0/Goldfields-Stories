import React from 'react';
import '../student.css';

const StudentForm = ({ studentName, setStudentName, handleSubmit }) => {
  return (
    <div className="student-form-container"> 
      <form onSubmit={handleSubmit} className="student-form">
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
          className="student-form-input"
        />
        <button type="submit" className="student-form-button"> 
          Add Student
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
