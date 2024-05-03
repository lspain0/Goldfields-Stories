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
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode
  const [editedClassName, setEditedClassName] = useState(""); // State to manage the edited class name
  const [sortMethod, setSortMethod] = useState("prompt");

  useEffect(() => {
    const classInfo = classes.find((c) => c.id === classId);
    if (classInfo) {
      setClassDetails(classInfo);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      fetchClasses().then(() => setIsLoading(false));
    }
  }, [classId, classes, fetchClasses]);

  // Function to handle sort method change
  const handleSortChange = (e) => {
    setSortMethod(e.target.value);
  };

  // Function to sort students based on the selected method
  const sortStudents = (students) => {
    switch (sortMethod) {
      case "prompt":
        return students;
      case "alphabetical":
        return students.sort((a, b) =>
          `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        );
      case "recentlyAdded":
        // Sort by the timestamp part of the MongoDB ObjectId
        return students.sort((a, b) =>
          parseInt(b._id.substring(0, 8), 16) - parseInt(a._id.substring(0, 8), 16)
        );
      case "oldestFirst":
        // Sort by the timestamp part of the MongoDB ObjectId
        return students.sort((a, b) =>
          parseInt(a._id.substring(0, 8), 16) - parseInt(b._id.substring(0, 8), 16)
        );
      case "youngestToOldest":
        // Sort students by age, youngest students first
        return students.sort((a, b) => {
          const dobA = new Date(a.dob);
          const dobB = new Date(b.dob);
          return dobB - dobA; // This will sort students by DOB, youngest first
        });
      case "oldestToYoungest":
        // Sort students by age, oldest students first
        return students.sort((a, b) => {
          const dobA = new Date(a.dob);
          const dobB = new Date(b.dob);
          return dobA - dobB; // This will sort students by DOB, oldest first
        });
      // Add more cases for custom options as needed
      default:
        return students;
    }
  };

  // Toggle edit mode and set initial edit value
  const handleEditClassName = () => {
    setIsEditing(true);
    setEditedClassName(classDetails.className);
  };

  // Save the edited class name
  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ className: editedClassName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedClass = await response.json();
      setClassDetails(updatedClass);

      await fetchClasses();

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating class name:", error);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Function to handle Transfer button click
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

  // Function to handle deleting a class
  const handleDeleteClass = async () => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        const response = await fetch(`/api/classes/${classId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        await fetchClasses();
        // Call fetchClasses from your context to refresh the class list
        navigate("/class");
        // Navigate back to the classes list page
      } catch (error) {
        console.error("Error deleting class:", error);
      }
    }
  };

  // Function to handle closing the transfer modal
  const onCloseTransferModal = () => {
    setShowTransferModal(false);
    fetchClasses();
  };

  // Function to handle back button click
  const handleBackClick = () => {
    navigate("/class");
  };

  // Function to handle Add Student button click
  const handleAddStudent = () => {
    navigate(`/class/${classId}/addstudent`);
  };

  // Function to handle deleting a student
  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await fetch(
          `/api/classes/${classId}/students/${studentId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("HTTP error! status: " + response.status);
        }
        await fetchClasses();
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!classDetails) {
    return <p>Class not found.</p>;
  }

  // Function to navigate to the student detail page
  const goToStudentDetail = (studentId) => {
    navigate(`/student/${studentId}`);
  };

  // Render the class details
  return (
    <div>
      <div className="header-buttons">
        <button className="standard-button-std" onClick={handleAddStudent}>
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
        <button className="standard-button" onClick={handleDeleteClass}>
          Delete Class
        </button>
        <button className="standard-button" onClick={handleBackClick}>
          Back
        </button>
      </div>

      {isEditing ? (
        <div className="edit-class-name">
          <input
            type="text"
            value={editedClassName}
            onChange={(e) => setEditedClassName(e.target.value)}
            className="edit-class-name-input"
            placeholder="Edit class name"
          />
          <div className="edit-buttons">
            <button onClick={handleSaveEdit} className="save-class-name-button action-button">Save</button>
            <button onClick={handleCancelEdit} className="cancel-class-name-button action-button">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="class-name-container">
          <div className="class-name" onClick={handleEditClassName}>
            Class: {classDetails.className}
            <div className="hover-box">
              Click to edit class name
            </div>
          </div>
          <select onChange={handleSortChange} className="sort-dropdown">
            <option value="prompt">Sort by :</option>
            <option value="alphabetical">Alphabetical Order</option>
            <option value="recentlyAdded">Recently Added</option>
            <option value="earliestAdded">Oldest First</option>
            <option value="youngestToOldest">Youngest to Oldest</option>
            <option value="oldestToYoungest">Oldest to Youngest</option>
          </select>
        </div>

      )}
     {classDetails.students && classDetails.students.length > 0 ? (
      <div className="student-cards-container">
        {sortStudents([...classDetails.students]).map((student) => (
          <div key={student._id} className="student-card" onClick={() => navigate(`/student/${student._id}`)}>
            {student.image && (
              <img
                src={student.image}
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
                e.stopPropagation(); // Prevent the select change from triggering the card's onClick event
                if (e.target.value === "edit") {
                  handleEditStudent(student._id);
                } else if (e.target.value === "delete") {
                  handleDeleteStudent(student._id);
                }
              }}
              className="student-actions-dropdown"
            >
              <option value="">Actions</option>
              <option value="edit">Edit</option>
              <option value="delete">Delete</option>
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

