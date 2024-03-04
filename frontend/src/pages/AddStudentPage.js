import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClassesContext } from "../context/ClassesContext";
import StudentForm from "../components/StudentForm";

const AddStudentPage = () => {
  const [student, setStudent] = useState({
    image: null,
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
  });
  const { classId } = useParams();
  const navigate = useNavigate();
  const { addStudentToClass } = useContext(ClassesContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addStudentToClass(classId, student);
      navigate(`/class/${classId}`);
    } catch (error) {
      console.error("Failed to add student:", error);
    }
  };

  const handleBack = () => {
    navigate(`/class/${classId}`);
  };

  return (
    <div>
      <h1>Add New Student</h1>
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
