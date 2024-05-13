import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { ClassesContext } from "../context/ClassesContext";
import StoryDetails from "../components/StoryDetails";
import '../StudentDetail.css';
import { MdAddAPhoto } from "react-icons/md"; // Import the icon
import { BsPersonSlash } from "react-icons/bs";

// This component will display the details of a student, including
const StudentDetail = () => {
  const [student, setStudent] = useState({
    image: null,
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
  });
  const [parent, setParent] = useState();
  const [stories, setStories] = useState([]); // New state for stories
  const [loadingParent, setLoadingParent] = useState(true); // New loading state for parent
  const [loadingStories, setLoadingStories] = useState(true); // New loading state for stories
  const [error, setError] = useState("");

  const { classId, studentId } = useParams();
  const navigate = useNavigate();
  const context = useContext(ClassesContext);

  const fetchStudentData = useCallback(() => context.fetchStudentData, [context]);

  // Fetch student data when the component mounts
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await fetchStudentData()(classId, studentId);
        const capitalizeFirstLetter = (str) => {
          return str.charAt(0).toUpperCase() + str.slice(1);
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
            })
          });
          fetchParent(data.firstName, data.lastName);
          fetchStories(data.firstName, data.lastName);
        } else {
          setError("No data found for this student.");
        }
      } catch (error) {
        console.error("Failed to fetch student:", error);
        setError("Failed to fetch student data. Please check the console for more details.");
      }
    };

    fetchStudent();
  }, [classId, studentId, fetchStudentData]);

  // Fetch the parent data for the student
  const fetchParent = async (firstName, lastName) => {
    setLoadingParent(true); // Ensure loading state is true when the function starts
    try {
      const response = await axios.get(`/api/users/parent/${firstName} ${lastName}`);
      if (response.status === 200 && response.data && response.data.parentName) {
        setParent(response.data.parentName);
      } else {
        setParent("No parent data available"); // Handle cases where data is incomplete or missing
      }
    } catch (error) {
      console.error("Failed to fetch parent:", error);
      setParent("No parent data available");
    } finally {
      setLoadingParent(false);
    }
  };

  // Fetch the stories for the student
  const fetchStories = async (firstName, lastName) => {
    setLoadingStories(true); // Ensure loading state is set to true at the beginning
    try {
      // Fetch stories by searching for the student's full name
      const response = await axios.get(`/api/stories/search?search=${firstName} ${lastName}`);
      if (response.status === 200 && response.data.length > 0) {
        setStories(response.data);
      } else {
        setStories([]); // Explicitly set an empty array if no stories are found or the response is not as expected
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
      setStories([]); // Ensure stories are set to an empty array on error
    } finally {
      setLoadingStories(false); // Ensure loading state is set to false after the API call
    }
  };

  const mapStories = () => {
    if (stories.length === 0) {
      return <p>No stories available for this student.</p>
    }
    return stories.map(story => (
      <StoryDetails story={story} key={story._id} />
    ));
  }

  // Display the student details and stories
  return (
    <div className="page-container">
      <div className="student-detail-container">
        {error ? <p className="error">{error}</p> : (
          <>
            <h1>{student.firstName} {student.lastName}</h1>
            {student.image ? (
              <img src={student.image} alt={`${student.firstName} ${student.lastName}`} className="student-image" />
            ) : (
              <BsPersonSlash size={200} className="placeholder-icon" />
            )}
            <p>Gender: {student.gender}</p>
            <p>Date of Birth: {student.dob}</p>
            <p>Parent: {parent || (loadingParent ? "Loading parent..." : "No parent data available")}</p>
            <button onClick={() => navigate(-1)}>Back</button>
          </>
        )}
      </div>
      {/* Display the stories for the student */}
      <div className="story-cards-container">
        {loadingStories ? <p>Loading stories...</p> : mapStories()}
      </div>
    </div>
  );

};

export default StudentDetail;
