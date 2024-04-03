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
  // State to hold the selected filter value
  const [storyFilter, setStoryFilter] = useState('All');

  useEffect(() => {
    document.body.style.backgroundColor = "#FFFFFF";
    
    return () => {
      document.body.style.backgroundColor = null;
    }
  }, []);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearchTerm = () => {
    setSearchTerm('');
  };

  const initiateSearch = async () => {
    const term = searchTerm.trim();
    setError('');
    setShowNotification(false);
    setStories([]);

    if (!term) {
      return;
    }

    try {
      // Modify the search endpoint to accept and process the filter parameter as needed
      const response = await axios_obj.get(`/stories/search?search=${term}&filter=${storyFilter}`);
      if (response.status === 200 && response.data.length > 0) {
        setStories(response.data);
      } else {
        setError('No stories found. Please try again.');
        setShowNotification(true);
      }
    } catch (err) {
      console.error('Error searching for stories:', err);
      setError('Failed to fetch stories. Please try again.');
      setShowNotification(true);
    }
  };

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
      <div className="search-bar-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Search by Author, Content, Tags, or Child's Name..."
          className="search-stories-input"
        />
        {searchTerm && (
          <button onClick={clearSearchTerm} className="clear-button">
            ×
          </button>
        )}
        {/* Dropdown for selecting the story filter */}
        <select
          value={storyFilter}
          onChange={(e) => setStoryFilter(e.target.value)}
          className="story-filter-dropdown"
        >
          <option value="All">All Stories</option>
          <option value="Individual">Individual Stories</option>
          <option value="Group">Group Stories</option>
        </select>
      </div>
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
