import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClassesContext } from "../context/ClassesContext";
import StudentForm from "../components/StudentForm";

// Page to edit a student
const EditStudentPage = () => {
  const [student, setStudent] = useState({
    image: null,
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
  });

  const { classId, studentId } = useParams();
  const navigate = useNavigate();
  const { updateStudentInClass, fetchStudentData } = useContext(ClassesContext);

  // Function to format the date in YYYY-MM-DD format for input[type="date"]
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch the student data when the component mounts
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await fetchStudentData(classId, studentId);
        if (data && data.dob) {
          // Format the DOB for input type="date"
          data.dob = formatDateForInput(data.dob);
        }
        setStudent((prev) => ({ ...prev, ...data }));
      } catch (error) {
        console.error("Failed to fetch student:", error);
      }
    };

    fetchStudent();
  }, [classId, studentId, fetchStudentData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare the dob for the backend in ISO format
    const dobParts = student.dob.split("-");
    const dobISO = new Date(
      dobParts[0],
      dobParts[1] - 1,
      dobParts[2]
    ).toISOString();

    const updatedStudent = {
      ...student,
      dob: dobISO,
    };

    try {
      await updateStudentInClass(classId, studentId, updatedStudent);
      navigate(`/class/${classId}`);
    } catch (error) {
      console.error("Failed to update student:", error);
    }
  };

  const handleBack = () => {
    navigate(`/class/${classId}`);
  };

  return (
    <div>
      <h1>Edit Student</h1>
      <StudentForm
        student={student}
        setStudent={setStudent}
        handleSubmit={handleSubmit}
        handleBack={handleBack}
        formType="edit"
      />
    </div>
  );
};

export default EditStudentPage;
