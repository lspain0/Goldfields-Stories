import React, { useEffect, useState } from "react";
import { useLocation, Link } from 'react-router-dom';
import axios_obj from "../axios";

var storyId;

function loadStoryID() {
  storyId = window.location.pathname.split('/')[2];
}

function adminControls() {
  if (window.location.href.includes('pending')) {
    return (
      <div className="pending-story-admin-controls">
        <button className="create-story-button" onClick={handlePostStory}>Post Story</button>
        <Link to={`/editstory/${storyId}`}>
          <button className="pending-story-button">Edit Story</button>
        </Link>
        <button className="pending-story-button" onClick={handleDeleteStory}>Delete Story</button>
      </div>
    );
  }
}

const handleDeleteStory = async () => {
  if (window.confirm("Are you sure you want to delete this story?")) {
    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Update state or perform any necessary actions upon successful update
        alert("Story Deleted!");
        setTimeout(function () {
          window.location.href = '/stories';
        }, 1);

      } else {
        const errorResponseText = await response.text();
        console.error(`Error deleting story with ID ${storyId}:`, errorResponseText);
      }

    } catch (error) {
      console.error(`Error deleting story with ID ${storyId}:`, error);
    }
  }
};

const handlePostStory = async () => {
  if (window.confirm("Are you sure you want to post this story?")) {
    try {
      const response = await fetch(`/api/stories/${storyId}/state`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state: 'approved' }) // Update state to 'approved'
      });

      if (response.ok) {
        // Update state or perform any necessary actions upon successful update
        alert("Story Posted!");
        setTimeout(function () {
          console.log(`Story with ID ${storyId} has been successfully approved.`);
          window.location.href = '/stories';
        }, 1);

      } else {
        const errorResponseText = await response.text();
        console.error(`Error approving story with ID ${storyId}:`, errorResponseText);
      }

    } catch (error) {
      console.error(`Error approving story with ID ${storyId}:`, error);
    }
  }
};


function addSpace(str) {
  return str.replaceAll(',', (', '))
}

function getName(str) {
  var firstName = str.split(' ')[0];
  var lastName = str.split(' ')[1];
  var fullName = firstName.charAt(0).toUpperCase() + firstName.slice(1) + (' ') + lastName.charAt(0).toUpperCase() + lastName.slice(1)

  return fullName;
}


const StoryPage = () => {
  const location = useLocation();
  const [currentStory, setCurrentStory] = useState(null);

  useEffect(() => {
    const fetchStoryById = async () => {
      const storyId = location.pathname.split('/')[2];
      
      if (storyId) {
        try {
          const response = await axios_obj.get(`/stories/${storyId}`);
          const json = response.data;

          if (parseInt(response.status) === 200) {
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
          <p className="info-content">{getName(currentStory.author)}</p>
        </div>
        <hr className="solid" />
        <div className="info-line">
          <p>Story Date:</p>
          <p className="info-content">{formatTimestamp(currentStory.createdAt)}</p>
        </div>
        <hr className="solid" />
        <p>Children in this story:</p>
        <p>{addSpace(currentStory.children)}</p>
        <hr className="solid" />
        {currentStory.tags !== '' && (
          <>
            <p>Learning Tags:</p>
            <div className="tags-container">
              {currentStory.tags.split('|').map((tag, index, array) => (
                <React.Fragment key={index}>
                  <div style={{ border: '2px solid lightblue', borderRadius: '4px', marginBottom: '4px', display: 'inline-block' }}>
                    <sub style={{ margin: '0', padding: '2px 4px', display: 'block' }}>{tag.trim()}</sub>
                  </div>
                  {index !== array.length - 1 && ' '}
                </React.Fragment>
              ))}
            </div>
            <hr className="solid" />
          </>
        )}
      </div>
    );
  };

  return (
    <body className="story-page-body">
      {loadStoryID()}
      {adminControls()}
      <div className="story-content">
        {/* parse HTML content */}
        <h2 dangerouslySetInnerHTML={parseHTML(currentStory.title)} />
        <div dangerouslySetInnerHTML={parseHTML(currentStory.content)} />
      </div>
      {generateStoryInfoHTML()}
    </body>
  );
};

export default StoryPage;