import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClassesContext } from '../context/ClassesContext';

const ClassDetails = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { classes } = useContext(ClassesContext);
  const [classDetails, setClassDetails] = useState(null);
  
  useEffect(() => {
    const classInfo = classes.find(c => c.id === classId);
    setClassDetails(classInfo);
  }, [classId, classes]);

  const handleAddStudent = () => {
    navigate(`/class/${classId}/addstudent`);
  };

  if (!classDetails) {
    return <p>Class not found.</p>;
  }

  return (
    <div>
      <h1>{classDetails.className}</h1>
      <p>{classDetails.subject}</p>
      <button onClick={handleAddStudent}>Add Student</button>
    </div>
  );
};

export default ClassDetails;
