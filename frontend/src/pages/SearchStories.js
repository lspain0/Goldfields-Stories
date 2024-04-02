import React, { useState, useEffect } from 'react';
import axios_obj from "../axios";
import StoryDetails from "../components/StoryDetails";
import "../searchstories.css";
import Logo2 from "../components/logov2";

const SearchStories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stories, setStories] = useState([]);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // This will run when the component mounts
    document.body.style.backgroundColor = "#FFFFFF"; // Set the body background color to white
    
    return () => {
      // This will run when the component unmounts
      document.body.style.backgroundColor = null; // Reset the body background color
    }
  }, []);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const initiateSearch = async () => {
    const term = searchTerm.trim();
    setError(''); // Clear any existing errors
    setShowNotification(false); // Hide any existing notifications
    setStories([]); // Clear previous stories right at the start of a new search

    if (!term) {
      return;
    }

    try {
      const response = await axios_obj.get(`/stories/search?search=${term}`);
      if (response.status === 200 && response.data.length > 0) {
        setStories(response.data);
      } else {
        setError('No stories found. Please try again.');
        setShowNotification(true);
      }
    } catch (err) {
      console.error('Error searching for stories:', err);
      setError('Failed to fetch stories. Please try again.');
      setShowNotification(true); // Show notification in case of error
    }
  };

  // Function to handle key press event on the input field
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      initiateSearch();
    }
  };

  return (
    <div className="search-stories-container">
      <div className="stories-logo-container">
        <Logo2 />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress} // Add the onKeyPress event listener
        placeholder="Search by Author, Content, Tags, or Child's Name..."
        className="search-stories-input"
      />
      <button onClick={initiateSearch} className="search-stories-button">Search</button>
      <div className="story-cards-container">
        {stories.length > 0 && (
          stories.map(story => (
            <StoryDetails story={story} key={story._id} />
          ))
        )}
      </div>
      <div className={`notification ${showNotification ? 'show' : ''}`}>
        {error}
        <button onClick={() => setShowNotification(false)}>×</button>
      </div>
    </div>
  );
};

export default SearchStories;
