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
  const [storyFilter, setStoryFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Date');

  useEffect(() => {
    document.body.style.backgroundColor = "#FFFFFF";
    
    return () => {
      document.body.style.backgroundColor = null;
    }
  }, []);

  useEffect(() => {
    if (searchTerm) { 
      initiateSearch();
    }
  }, [storyFilter, sortOption]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearchTerm = () => {
    setSearchTerm('');
    setStories([]);
    setError(''); 
    setShowNotification(false);
  };

  const sortStories = (stories) => {
    if (sortOption === 'Title') {
      return stories.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      return stories.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
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
      const response = await axios_obj.get(`/stories/search?search=${term}&filter=${storyFilter}`);
      if (response.status === 200 && response.data.length > 0) {
        const sortedStories = sortStories(response.data);
        setStories(sortedStories);
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
    <body className='search-body'>
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
        <div className="filters-container"> {/* New container for filters */}
          <select
            value={storyFilter}
            onChange={(e) => setStoryFilter(e.target.value)}
            className="story-filter-dropdown"
          >
            <option value="All">All Stories</option>
            <option value="Individual">Individual Stories</option>
            <option value="Group">Group Stories</option>
          </select>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-dropdown"
          >
            <option value="Date">Sort by Date</option>
            <option value="Title">Sort by Title</option>
          </select>
        </div>
      </div>
      <button onClick={initiateSearch} className="search-stories-button">Search</button>
      <div className={`notification ${showNotification ? 'show' : ''}`}>
        {error}
        <button onClick={() => setShowNotification(false)}>×</button>
      </div>
    </div>
    <div className="story-cards-container">
        {stories.length > 0 && (
          stories.map(story => (
            <StoryDetails story={story} key={story._id} />
          ))
        )}
      </div>
    </body>
  );
};

export default SearchStories;
