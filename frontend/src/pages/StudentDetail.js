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
  const [parent, setParent] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { classId, studentId } = useParams();
  const navigate = useNavigate();
  const context = useContext(ClassesContext);

  const fetchStudentData = useCallback(() => context.fetchStudentData, [context]);

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
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch student:", error);
        setError("Failed to fetch student data. Please check the console for more details.");
        setLoading(false);
      }
    };

    fetchStudent();
  }, [classId, studentId, fetchStudentData]);

  const fetchParent = async (firstName, lastName) => {
    try {
      const response = await axios.get(`/api/users/parent/${firstName} ${lastName}`);
      if (response.status === 200 && response.data) {
        setParent(response.data.parentName);
      }
    } catch (error) {
      console.error("Failed to fetch parent:", error);
    }
  };

  const fetchStories = async (firstName, lastName) => {
    try {
      const response = await axios.get(`/api/stories/search?search=${firstName} ${lastName}`);
      if (response.status === 200) {
        setStories(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch stories:", error);
      setLoading(false);
    }
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
            <p>Parent: {parent || "No parent data available"}</p>
            <button onClick={() => navigate(-1)}>Back</button>
          </>
        )}
      </div>
      <div className="story-cards-container">
        {loading ? (
          <p>Loading stories...</p>
        ) : stories.length > 0 ? (
          stories.map(story => (
            <StoryDetails story={story} key={story._id} />
          ))
        ) : <p>No stories available for this student.</p>}
      </div>
    </div>
  );
};

export default StudentDetail;
