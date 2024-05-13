import React, { useRef, useEffect } from "react";
import "../student.css";
import { MdAddAPhoto } from "react-icons/md";

// StudentForm component
const StudentForm = ({
  student,
  setStudent,
  handleSubmit,
  handleBack,
  formType,
}) => {
  const cloudinaryWidgetRef = useRef();

  // Initialize the Cloudinary widget
  useEffect(() => {
    cloudinaryWidgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: 'drpnvb7qc',
        uploadPreset: 'tetlineq',
        sources: [ 'local '],
      clientAllowedFormats: ['image']
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          // Update the student state with the uploaded image URL
          setStudent({ ...student, image: result.info.secure_url });
        }
      }
    );
  }, [student, setStudent]);

  // Update the student state when the user types in the form
  const updateField = (e) => {
    if (e.target.name === "dob") {
      const selectedDate = new Date(e.target.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        alert("Date of birth cannot be in the future.");
        return;
      }
    }
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  // Open the Cloudinary widget when the user clicks the "Upload Image" button
  const handleImageUpload = (e) => {
    e.preventDefault();
    cloudinaryWidgetRef.current.open();
  };

  // Get today's date in the format "YYYY-MM-DD"
  const today = new Date().toISOString().split("T")[0];
  const minDate = "1980-01-01";

  // Render the student form
  return (
    <div className="student-form-container">
      <form onSubmit={handleSubmit} className="student-form">
        <div className="image-upload-container">
          {student.image ? (
            <img src={student.image} alt="Student" className="student-image"/>
          ) : (
            <div className="student-image-placeholder">
            <MdAddAPhoto size={50} />
            </div>
          )}
          <button onClick={handleImageUpload} className="standard-button">
            Upload Image
          </button>
        </div>
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
          value={student.dob ? student.dob.split("/").reverse().join("-") : ""}
          onChange={updateField}
          required
          className="student-form-input"
          min={minDate}
          max={today}
        />
        <button type="submit" className="standard-button">
          {formType === "edit" ? "Update Student" : "Add Student"}
        </button>
        <button type="button" onClick={handleBack} className="standard-button">
          Back
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
