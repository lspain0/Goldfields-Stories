import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClassesContext } from "../context/ClassesContext";
import StudentForm from "../components/StudentForm";
import "../student.css";

// Add student page component
const AddStudentPage = () => {
  const [student, setStudent] = useState({
    image: null,
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
  });
  // Get classId from URL params
  const { classId } = useParams();
  // Get the addStudentToClass function from the ClassesContext
  const navigate = useNavigate();
  // Get the addStudentToClass function from the ClassesContext
  const { addStudentToClass } = useContext(ClassesContext);
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addStudentToClass(classId, student);
      navigate(`/class/${classId}`);
    } catch (error) {
      console.error("Failed to add student:", error);
    }
  };
  // Handle back button click
  const handleBack = () => {
    navigate(`/class/${classId}`);
  };

  // Render the AddStudentPage
  return (
    <div className="student-form-centered">
      <h1 class="custom-h1">Add New Student</h1>
      <StudentForm
        student={student}
        setStudent={setStudent}
        handleSubmit={handleSubmit}
        handleBack={handleBack}
      />
    </div>
  );
};

export default AddStudentPage;
