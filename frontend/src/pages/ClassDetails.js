import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClassesContext } from "../context/ClassesContext";
import "../student.css";
import TransferStudentModal from "../components/TransferStudentModal";

const ClassDetails = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { classes, fetchClasses } = useContext(ClassesContext);
  const [classDetails, setClassDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const handleTransferClick = () => {
    setShowTransferModal(true);
  };

  // Function to handle Edit button click
  const handleEditStudent = (studentId) => {
    navigate(`/class/${classId}/editstudent/${studentId}`);
  };

  // Function to format the date as "DD/MM/YYYY"
  const formatDate = (date) => {
    const dobDate = new Date(date);
    const day = dobDate.getDate().toString().padStart(2, "0");
    const month = (dobDate.getMonth() + 1).toString().padStart(2, "0");
    const year = dobDate.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };
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
    if (classInfo) {
      setClassDetails(classInfo);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [classId, classes]);

  const onCloseTransferModal = () => {
    setShowTransferModal(false);
    fetchClasses();
  };

  // Function to handle back button click
  const handleBackClick = () => {
    navigate("/class");
  };

  const handleAddStudent = () => {
    navigate(`/class/${classId}/addstudent`);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!classDetails) {
    return <p>Class not found.</p>;
  }

  return (
    <div>
      <button className="standard-button" onClick={handleAddStudent}>
        Add Student
      </button>
      <button className="standard-button" onClick={handleTransferClick}>
        Transfer Student
      </button>
      {showTransferModal && (
        <TransferStudentModal
          students={classDetails.students}
          currentClassId={classId}
          onClose={onCloseTransferModal}
        />
      )}
      <button className="standard-button" onClick={handleBackClick}>
        Back
      </button>

      <div className="class-name">
        {classDetails.className} / {classDetails.subject}
      </div>

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
                <span className="student-name">
                  {student.firstName} {student.lastName}
                </span>
                <span>DOB: {formatDate(student.dob)}</span>
              </div>
              <select
                onChange={(e) => {
                  if (e.target.value === "edit") {
                    handleEditStudent(student._id);
                  }
                }}
              >
                <option value="">Actions</option>
                <option value="edit">Edit</option>
              </select>
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
