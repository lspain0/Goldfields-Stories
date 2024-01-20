import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClassesContext } from '../context/ClassesContext';
import StudentForm from '../components/StudentForm';

const AddStudentPage = () => {
  const [studentName, setStudentName] = useState('');
  const { classId } = useParams();
  const navigate = useNavigate();
  const { addStudentToClass } = useContext(ClassesContext);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await addStudentToClass(classId, studentName);
    navigate(`/class/${classId}`);
  } catch (error) {
    console.error("Failed to add student:", error);
  }
};

  return (
    <div>
      <h1>Add Student</h1>
      <StudentForm
        studentName={studentName}
        setStudentName={setStudentName}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddStudentPage;
