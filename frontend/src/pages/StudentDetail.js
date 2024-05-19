// Import necessary modules and components
import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { ClassesContext } from "../context/ClassesContext";
import StoryDetails from "../components/StoryDetails";
import '../StudentDetail.css';
import { BsPersonSlash } from "react-icons/bs";

// Component to display error messages or loading state
const ErrorMessage = ({ message, loading }) => {
  const [show, setShow] = useState(true); // State to control visibility of the message

  return (
    <div className={`notification ${show ? 'show' : ''}`}>
      <span>{loading ? "Loading..." : message}</span> 
      {!loading && <button onClick={() => setShow(false)}>×</button>}
    </div>
  );
};

// Main component to display student details
const StudentDetail = () => {
  const [student, setStudent] = useState({
    image: null,
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
  });
  const [parents, setParents] = useState([]);
  const [stories, setStories] = useState([]);
  const [loadingParent, setLoadingParent] = useState(true);
  const [loadingStories, setLoadingStories] = useState(true);
  const [error, setError] = useState("");

  const { classId, studentId } = useParams(); // Get classId and studentId from URL parameters
  const navigate = useNavigate(); // Navigation hook to redirect or go back
  const context = useContext(ClassesContext); // Get context for fetching student data

  const fetchStudentData = useCallback(() => context.fetchStudentData, [context]); // Callback to fetch student data

  // Effect to fetch student details on component mount or when classId/studentId changes
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await fetchStudentData()(classId, studentId); // Fetch student data
        const capitalizeFirstLetter = (str) => {
          return str.charAt(0).toUpperCase() + str.slice(1); // Helper to capitalize gender
        };

        if (data) {
          setStudent({
            image: data.image || null,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: capitalizeFirstLetter(data.gender),
            dob: new Date(data.dob).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }) // Format date of birth
          });
          fetchParents(`${data.firstName} ${data.lastName}`); // Fetch parents for the student
          fetchStories(`${data.firstName} ${data.lastName}`); // Fetch stories for the student
        } else {
          setError("No data found for this student."); // Set error if no data found
        }
      } catch (error) {
        console.error("Failed to fetch student:", error);
        setError("Failed to fetch student data. Please check the console for more details."); // Set error on fetch failure
      }
    };

    fetchStudent(); // Call fetchStudent function
  }, [classId, studentId, fetchStudentData]); // Dependencies for useEffect

  // Function to fetch parents data
  const fetchParents = async (childName) => {
    setLoadingParent(true); // Set loading state for parents
    try {
      const response = await axios.get(`/api/users/parent/${encodeURIComponent(childName)}`); // Fetch parents from API
      if (response.status === 200 && response.data.length > 0) {
        setParents(response.data); // Set parents if data found
      } else {
        setParents([]); // Set empty array if no parents found
      }
    } catch (error) {
      console.error("Failed to fetch parents:", error);
      setParents([]); // Set empty array on error
    } finally {
      setLoadingParent(false); // Remove loading state
    }
  };

  // Function to fetch stories data
  const fetchStories = async (childName) => {
    setLoadingStories(true); // Set loading state for stories
    try {
      const response = await axios.get(`/api/stories/search?search=${encodeURIComponent(childName)}`); // Fetch stories from API
      if (response.status === 200 && response.data.length > 0) {
        setStories(response.data); // Set stories if data found
      } else {
        setStories([]); // Set empty array if no stories found
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
      setStories([]); // Set empty array on error
    } finally {
      setLoadingStories(false); // Remove loading state
    }
  };

  // Function to map stories to StoryDetails component
  const mapStories = () => {
    if (loadingStories) {
      return <ErrorMessage loading={true} />; // Show loading message if loading
    }
    if (stories.length === 0) {
      return <ErrorMessage message="No stories available for this student." />; // Show no stories message if none found
    }
    return stories.map(story => (
      <StoryDetails story={story} key={story._id} /> // Map each story to StoryDetails component
    ));
  };

  return (
    <div className="page-container">
      <div className="student-detail-container">
        {error ? <ErrorMessage message={error} /> : ( // Show error message if error exists
          <>
            <h1>{student.firstName} {student.lastName}</h1>
            {student.image ? (
              <img src={student.image} alt={`${student.firstName} ${student.lastName}`} className="student-image" />
            ) : (
              <BsPersonSlash size={200} className="placeholder-icon" /> // Display placeholder if no image
            )}
            <p>Gender: {student.gender}</p> 
            <p>Date of Birth: {student.dob}</p>
            <div className="parent-list">
              <p>Parents:</p>
              <ul>
                {loadingParent ? <ErrorMessage loading={true} /> : parents.length > 0 ? ( // Show loading or list of parents
                  parents.map(parent => (
                    <li key={parent.email}>
                      {parent.parentName} ({parent.email})
                    </li>
                  ))
                ) : "No parents have been assigned."} 
              </ul>
            </div>
            <button onClick={() => navigate(-1)}>Back</button>
          </>
        )}
      </div>
      <div className="story-cards-container">
        {mapStories()}
      </div>
    </div>
  );
};

export default StudentDetail; // Export the component
