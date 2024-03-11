import React, { useRef, useEffect } from "react";
import "../student.css";

const StudentForm = ({
  student,
  setStudent,
  handleSubmit,
  handleBack,
  formType,
}) => {
  const cloudinaryWidgetRef = useRef();

  useEffect(() => {
    cloudinaryWidgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: "your_cloud_name", // Replace with your Cloudinary cloud name
        uploadPreset: "your_preset", // Replace with your upload preset
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          // Update the student state with the uploaded image URL
          setStudent({ ...student, image: result.info.secure_url });
        }
      }
    );
  }, [student, setStudent]);

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

  const handleImageUpload = (e) => {
    e.preventDefault();
    cloudinaryWidgetRef.current.open();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="student-form-container">
      <form onSubmit={handleSubmit} className="student-form">
        <button onClick={handleImageUpload} className="standard-button">
          Upload Image
        </button>
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
