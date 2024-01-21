import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClassesContext } from "../context/ClassesContext";
import "../student.css";


const ClassDetails = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { classes } = useContext(ClassesContext);
  const [classDetails, setClassDetails] = useState(null);

  useEffect(() => {
    const classInfo = classes.find((c) => c.id === classId);
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
      <h1>{classDetails.className} / {classDetails.subject}</h1>
      <button onClick={handleAddStudent}>Add Student</button>
      {classDetails.students && classDetails.students.length > 0 ? (
        <div className="student-cards-container">
          {classDetails.students.map((student, index) => (
            <div key={student._id || student.name} className="student-card">
              <span>{student.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No students in this class yet.</p>
      )}
    </div>
  );
  
};

export default ClassDetails;
