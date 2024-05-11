import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import axios_obj from "../axios";
import StoryDetails from "../components/StoryDetails";
import "../searchstories.css";
import Logo2 from "../components/logov2";
import { FaSearch } from 'react-icons/fa';

// Search for stories by author, content, tags, or child's name
const SearchStories = () => {
  const navigate = useNavigate(); // Navigate to a new URL
  const location = useLocation(); // Get current location
  const queryParams = queryString.parse(location.search); 
  const initialSearchTerm = queryParams.search || ''; 
  const initialFilter = queryParams.filter || 'All'; 
  const initialSortOption = queryParams.sort || 'Date'; // Default sort option
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [stories, setStories] = useState([]);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [storyFilter, setStoryFilter] = useState(initialFilter);
  const [sortOption, setSortOption] = useState(initialSortOption);

  // Set background color to white
  useEffect(() => {
    document.body.style.backgroundColor = "#FFFFFF";
    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  // Fetch stories when query parameters change
  useEffect(() => {
    initiateSearch();
  }, [location.search]); // Rerun search when query parameters change

  useEffect(() => {
    initiateSearch(); // Trigger search when filter or sort options change
  }, [storyFilter, sortOption]); // Listen for changes in filter and sort options

  // Update query parameters when search term, filter, or sort option changes
  const updateQueryParams = () => {
    navigate(`?search=${searchTerm}&filter=${storyFilter}&sort=${sortOption}`, { replace: true });
  };

  // Handle input change in search bar
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Clear search term and reset stories
  const clearSearchTerm = () => {
    setSearchTerm('');
    setStories([]);
    setError(''); 
    setShowNotification(false);
    updateQueryParams();
  };

  // Sort stories by title or date
  const sortStories = (stories) => {
    if (sortOption === 'Title') {
      return stories.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      return stories.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  };

  // Initiate search for stories
  const initiateSearch = async () => {
    const term = searchTerm.trim();
    setError('');
    setShowNotification(false);
    setStories([]);

    if (!term) {
      return;
    }

    // Fetch stories based on search term, filter, and sort option
    try {
      const response = await axios_obj.get(`/stories/search?search=${term}&filter=${storyFilter}&sort=${sortOption}`);
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

    updateQueryParams();
  };

  // Handle Enter key press to initiate search
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      initiateSearch();
    }
  };

  useEffect(() => {

    //Getting the route path from window location
    const currentRoute = window.location.pathname;
    try {
      //if current route is not in change password then checks for change in the localStorage
      if (currentRoute != "/change_password") {
        let change = localStorage.getItem("change");

        //if change is set to '1' that means user needs to change password
        if (change == "1") {
          window.location.href = "/change_password";
        }
      }
    }
    //Catching any exceptions that might happen, does nothing if it does happen
    catch (ex) {
    }
  }, []);
  
  // Render search stories page
  return (
    <body className='search-body'>
    <div className="search-stories-container">
      <div className="stories-logo-container">
        <Logo2 />
      </div>
      <div className="search-bar-container">
      <FaSearch className="search-icon"/>
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