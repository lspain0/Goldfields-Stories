import { useEffect, useState } from "react";
import { useLocation, Link } from 'react-router-dom';

const StoryPage = () => {
  const location = useLocation();
  const [currentStory, setCurrentStory] = useState(null);

  useEffect(() => {
    const fetchStoryById = async () => {
      const storyId = location.pathname.split('/story/')[1];

      if (storyId) {
        try {
          const response = await fetch(`/api/stories/${storyId}`);
          const json = await response.json();

          if (response.ok) {
            setCurrentStory(json);
          } else {
            console.error(`Error fetching story with ID ${storyId}:`, json);
          }
        } catch (error) {
          console.error(`Error fetching story with ID ${storyId}:`, error);
        }
      }
    };

    fetchStoryById();
  }, [location.pathname]);

  // Render nothing while currentStory is being loaded
  if (!currentStory) {
    return null;
  }

  // Function to parse HTML string
  const parseHTML = (html) => {
    return { __html: html };
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-UK', options);

    return formattedDate;
  };

  const generateStoryInfoHTML = () => {
    return (
      <div className="story-info">
        <div className="info-line">
          <p>Author:</p>
          <p className="info-content">Author Author</p>
        </div>
        <hr className="solid" />
        <div className="info-line">
          <p>Story Date:</p>
          <p className="info-content">{formatTimestamp(currentStory.createdAt)}</p>
        </div>
        <hr className="solid" />
        <p>Children in this story:</p>
        <p>{currentStory.children}</p>
        <hr className="solid" />
        {currentStory.tags !== '' && (
          <>
            <p>Learning Tags:</p>
            <p>{currentStory.tags}</p>
            <hr className="solid" />
          </>
        )}
      </div>
    );
  };
  
  
  
  
  return (
    <body className="story-page-body">
      <div className="story-content">
        {/* parse HTML content */}
        <h3 dangerouslySetInnerHTML={parseHTML(currentStory.title)} />
        <div dangerouslySetInnerHTML={parseHTML(currentStory.content)} />
      </div>
      {generateStoryInfoHTML()}
    </body>
  );
};

export default StoryPage;