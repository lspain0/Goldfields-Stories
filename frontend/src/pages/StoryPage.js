import { useEffect, useState } from "react";
import { useLocation, Link } from 'react-router-dom';

// components

const Home = () => {
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

  const parser = new DOMParser()

  return (
    <body>
      {/* parse HTML content */}
      <h3 dangerouslySetInnerHTML={parseHTML(currentStory.title)} />
      <div dangerouslySetInnerHTML={parseHTML(currentStory.content)} />
    </body>
  );
};

export default Home;