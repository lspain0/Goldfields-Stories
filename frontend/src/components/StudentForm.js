import React from "react";
import "../student.css";

const StudentForm = ({ student, setStudent, handleSubmit, handleBack }) => {
  const updateField = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  return (
    <div className="student-form-container">
      <form onSubmit={handleSubmit} className="student-form">
        <input
          type="file"
          onChange={(e) => setStudent({ ...student, image: e.target.files[0] })}
          className="student-form-input"
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={student.firstName}
          onChange={updateField}
          required
          className="student-form-input"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={student.lastName}
          onChange={updateField}
          required
          className="student-form-input"
        />
        <select
          name="gender"
          value={student.gender}
          onChange={updateField}
          required
          className="student-form-input"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="date"
          name="dob"
          value={student.dob.split("/").reverse().join("-")} // Convert DD/MM/YYYY to YYYY-MM-DD for input display
          onChange={updateField}
          required
          className="student-form-input"
        />
        <input
          type="text"
          name="emergencyContact"
          placeholder="Emergency Contact"
          value={student.emergencyContact}
          onChange={updateField}
          required
          className="student-form-input"
        />
        <button type="submit" className="standard-button">
          Add Student
        </button>
        <button type="button" onClick={handleBack} className="standard-button">
          Back
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
