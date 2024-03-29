import React, { useState } from 'react';
import axios_obj from "../axios";
import StoryDetails from "../components/StoryDetails";

const SearchStories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stories, setStories] = useState([]);
  const [error, setError] = useState(''); // State to handle errors

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const initiateSearch = async () => {
    const term = searchTerm.trim();

    if (!term) {
      setStories([]); // Clear stories if search term is empty
      return;
    }

    try {
        const response = await axios_obj.get(`/stories/search?search=${term}`);
      if (response.status === 200) {
        setStories(response.data);
      }
    } catch (error) {
      console.error('Error searching for stories:', error);
      setError('Failed to fetch stories. Please try again.'); // Setting error message
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search for stories..."
      />
      <button onClick={initiateSearch}>Search</button> {/* Search button */}
      {error && <p className="error">{error}</p>} {/* Display error message if any */}
      <div className="story-cards-container">
        {stories.length > 0 ? (
          stories.map(story => (
            <StoryDetails story={story} key={story._id} />
          ))
        ) : (
          <p>No stories found.</p> // Message displayed when no stories are found
        )}
      </div>
    </div>
  );
};

export default SearchStories;
