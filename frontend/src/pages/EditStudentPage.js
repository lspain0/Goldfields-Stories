import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClassesContext } from '../context/ClassesContext';
import StudentForm from '../components/StudentForm';

const EditStudentPage = () => {
  const [student, setStudent] = useState({
    image: null,
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    emergencyContact: ''
  });
  const { classId, studentId } = useParams();
  const navigate = useNavigate();
  const { classes, updateStudentInClass } = useContext(ClassesContext);

  useEffect(() => {
    // Fetch the student data from the API
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/classes/${classId}/students/${studentId}`);
        if (!response.ok) {
          throw new Error('HTTP error! status: ' + response.status);
        }
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error("Failed to fetch student:", error);
      }
    };

    fetchStudent();
  }, [classId, studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStudentInClass(classId, studentId, student);
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
      />
    </div>
  );
};

export default EditStudentPage;
