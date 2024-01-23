import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClassesContext } from "../context/ClassesContext";
import "../student.css";

const ClassDetails = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { classes } = useContext(ClassesContext);
  const [classDetails, setClassDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to convert buffer to URL
  const bufferToUrl = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  useEffect(() => {
    const classInfo = classes.find((c) => c.id === classId);
    setClassDetails(classInfo);
    
    // Set loading to false after fetching the class
    setIsLoading(false);
  }, [classId, classes]);

  const handleAddStudent = () => {
    navigate(`/class/${classId}/addstudent`);
  };

  if (isLoading) {
    return <p>Loading...</p>; // Show loading message during loading state
  }

  if (!classDetails) {
    return <p>Class not found.</p>; // Show this only if not loading and classDetails is null
  }

  return (
    <div>
      <h1>
        {classDetails.className} / {classDetails.subject}
      </h1>
      <button className="student-details-button" onClick={handleAddStudent}>
        Add Student
      </button>
      {classDetails.students && classDetails.students.length > 0 ? (
        <div className="student-cards-container">
          {classDetails.students.map((student) => (
            <div key={student._id} className="student-card">
              {student.image && (
                <img
                  src={`data:image/jpeg;base64,${bufferToUrl(
                    student.image.data
                  )}`}
                  alt={`${student.firstName} ${student.lastName}`}
                  className="student-card-image"
                />
              )}
              <div className="student-card-info">
                <span>
                  {student.firstName} {student.lastName}
                </span>
                <span>DOB: {new Date(student.dob).toLocaleDateString()}</span>
              </div>
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
