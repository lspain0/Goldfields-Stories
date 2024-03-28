import React, { useState } from 'react';

const SearchStories = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Add search logic or API call
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search for stories..."
      />
      {/* Display search results here */}
    </div>
  );
};
export default SearchStories;
