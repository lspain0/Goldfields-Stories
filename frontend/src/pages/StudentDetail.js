import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClassesContext } from "../context/ClassesContext";
import '../StudentDetail.css'; 

const StudentDetail = () => {
  const [student, setStudent] = useState({
    image: null,
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
  });
  const [error, setError] = useState("");

  const { classId, studentId } = useParams();
  const navigate = useNavigate();
  const { fetchStudentData } = useContext(ClassesContext); 

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await fetchStudentData(classId, studentId);
        if (data) {
          setStudent(prevStudent => ({
            ...prevStudent,
            image: data.image || null,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            dob: new Date(data.dob).toLocaleDateString() // Format date
          }));
        } else {
          setError("No data found for this student.");
          console.log("Received empty data object from API");
        }
      } catch (error) {
        console.error("Failed to fetch student:", error);
        setError("Failed to fetch student data. Please check the console for more details.");
      }
    };

    fetchStudent();
  }, [classId, studentId, fetchStudentData]);

  return (
    <div className="student-detail-container">
      {error ? <p className="error">{error}</p> : (
        <>
          <h1>{student.firstName} {student.lastName}</h1>
          {student.image && <img src={student.image} alt={`${student.firstName} ${student.lastName}`} className="student-image" />}
          <p>Gender: {student.gender}</p>
          <p>Date of Birth: {student.dob}</p>
          <button onClick={() => navigate(-1)}>Back</button>
        </>
      )}
    </div>
  );
};

export default StudentDetail;
