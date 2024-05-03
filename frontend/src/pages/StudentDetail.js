import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClassesContext } from "../context/ClassesContext";

// Student Detail Page
const StudentDetail = () => {
  const [student, setStudent] = useState({
    image: null,
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
  });

  const { studentId } = useParams(); 
  console.log("Student ID:", studentId);
  const navigate = useNavigate();
  const { fetchStudentData } = useContext(ClassesContext); 

  // Fetch the student data when the component mounts
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await fetchStudentData(studentId);
        if (data && data.dob) {
          
          setStudent(data);
        }
      } catch (error) {
        console.error("Failed to fetch student:", error);
      }
    };

    fetchStudent();
  }, [studentId, fetchStudentData]);

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div>
      <h1>{student.firstName} {student.lastName}</h1>
      {student.image && <img src={student.image} alt={`${student.firstName} ${student.lastName}`} />}
      <p>Gender: {student.gender}</p>
      <p>Date of Birth: {student.dob}</p>
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default StudentDetail;
