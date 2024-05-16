import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { ClassesContext } from "../context/ClassesContext";
import StoryDetails from "../components/StoryDetails";
import '../StudentDetail.css';
import { BsPersonSlash } from "react-icons/bs";

const ErrorMessage = ({ message, loading }) => {
  const [show, setShow] = useState(true);

  return (
    <div className={`notification ${show ? 'show' : ''}`}>
      <span>{loading ? "Loading..." : message}</span>
      {!loading && <button onClick={() => setShow(false)}>×</button>}
    </div>
  );
};

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
          fetchParents(`${data.firstName} ${data.lastName}`);
          fetchStories(`${data.firstName} ${data.lastName}`);
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

  const fetchParents = async (childName) => {
    setLoadingParent(true);
    try {
      const response = await axios.get(`/api/users/parent/${encodeURIComponent(childName)}`);
      if (response.status === 200 && response.data.length > 0) {
        setParents(response.data);
      } else {
        setParents([]);
      }
    } catch (error) {
      console.error("Failed to fetch parents:", error);
      setParents([]);
    } finally {
      setLoadingParent(false);
    }
  };

  const fetchStories = async (childName) => {
    setLoadingStories(true);
    try {
      const response = await axios.get(`/api/stories/search?search=${encodeURIComponent(childName)}`);
      if (response.status === 200 && response.data.length > 0) {
        setStories(response.data);
      } else {
        setStories([]);
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
      setStories([]);
    } finally {
      setLoadingStories(false);
    }
  };

  const mapStories = () => {
    if (loadingStories) {
      return <ErrorMessage loading={true} />;
    }
    if (stories.length === 0) {
      return <ErrorMessage message="No stories available for this student." />;
    }
    return stories.map(story => (
      <StoryDetails story={story} key={story._id} />
    ));
  };

  return (
    <div className="page-container">
      <div className="student-detail-container">
        {error ? <ErrorMessage message={error} /> : (
          <>
            <h1>{student.firstName} {student.lastName}</h1>
            {student.image ? (
              <img src={student.image} alt={`${student.firstName} ${student.lastName}`} className="student-image" />
            ) : (
              <BsPersonSlash size={200} className="placeholder-icon" />
            )}
            <p>Gender: {student.gender}</p>
            <p>Date of Birth: {student.dob}</p>
            <div className="parent-list">
              <p>Parents:</p>
              <ul>
                {loadingParent ? <ErrorMessage loading={true} /> : parents.length > 0 ? (
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

export default StudentDetail;
