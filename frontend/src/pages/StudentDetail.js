import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { ClassesContext } from "../context/ClassesContext";
import StoryDetails from "../components/StoryDetails";
import '../StudentDetail.css';


const StudentDetail = () => {
  const [student, setStudent] = useState({
    image: null,
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
  });
  const [stories, setStories] = useState([]);
  const [error, setError] = useState("");

  const { classId, studentId } = useParams();
  const navigate = useNavigate();
  const context = useContext(ClassesContext);
  
  // Using useCallback to memoize fetchStudentData
  const fetchStudentData = useCallback(() => context.fetchStudentData, [context]);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await fetchStudentData()(classId, studentId);  // Adjusted to call the memoized function
        if (data) {
          setStudent({
            image: data.image || null,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            dob: new Date(data.dob).toLocaleDateString()
          });
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

  const fetchStories = async (firstName, lastName) => {
    try {
      const response = await axios.get(`/api/stories/search?search=${firstName} ${lastName}`);
      if (response.status === 200 && response.data.length > 0) {
        setStories(response.data);
      } else {
        console.log('No stories found for this student.');
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    }
  };

  // Function to handle story click
  const handleStoryClick = (storyId) => {
    navigate(`/stories/${storyId}`); // Adjust the URL path as necessary
  };

  return (
    <div className="page-container">
      <div className="student-detail-container">
        {error ? <p className="error">{error}</p> : (
          <>
            <h1>{student.firstName} {student.lastName}</h1>
            {student.image && <img src={student.image} alt={`${student.firstName} ${student.lastName}`} className="student-image" />}
            <p>Gender: {student.gender}</p>
            <p>Date of Birth: {student.dob}</p>
            <button onClick={() => navigate(-1)}>Back</button>
          </>
        )}
      </div>
      <div className="story-cards-container">
        {stories.length > 0 ? stories.map(story => (
          <div onClick={() => handleStoryClick(story._id)} key={story._id}>
            <StoryDetails story={story} />
          </div>
        )) : <p>No stories available for this student.</p>}
      </div>
    </div>
  );
};

export default StudentDetail;
