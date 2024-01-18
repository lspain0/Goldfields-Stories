import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ClassesContext } from '../context/ClassesContext';

const ClassDetails = () => {
  const { classId } = useParams();
  const { classes } = useContext(ClassesContext);
  const [classDetails, setClassDetails] = useState(null);
  
  useEffect(() => {
    // Find the class by ID from context or fetch from the backend
    const classInfo = classes.find(c => c.id === classId);
    setClassDetails(classInfo);
  }, [classId, classes]);

  if (!classDetails) {
    return <p>Class not found.</p>;
  }

  return (
    <div>
      <h1>{classDetails.className}</h1>
      <p>{classDetails.subject}</p>
      <button className="add-student-btn">Add Student</button>
      <button>Add Student</button>
    </div>
  );
};

export default ClassDetails;
