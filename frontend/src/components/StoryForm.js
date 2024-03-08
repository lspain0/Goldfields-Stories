import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useStoriesContext } from "../hooks/useStoriesContext";
import { CheckTreePicker } from 'rsuite';
import '../index.css';
import { groupedTags } from "./docs/tags";
import StudentList from "./docs/StudentList";
import { useLocation, Link } from 'react-router-dom';

var editing = false;

function isEditing() {
  if (window.location.pathname.includes('editstory'))
  {
    editing = true;
  }
};

function getName(str) {
  var firstName = str.split(' ')[0];
  var lastName = str.split(' ')[1];
  var fullName = firstName.charAt(0).toUpperCase() + firstName.slice(1) + (' ') + lastName.charAt(0).toUpperCase() + lastName.slice(1)

  return fullName;
}

const UploadWidget = ({ onImageUpload }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget({
      cloudName: 'drpnvb7qc',
      uploadPreset: 'tetlineq'
    }, function (error, result) {
      if (!error && result && result.event === "success") {
        const imageUrl = result.info.secure_url;
        onImageUpload(imageUrl);
      }
    });
  }, [onImageUpload]);

  const handleButtonClick = (e) => {
    e.preventDefault(); // Prevent the form from being submitted
    widgetRef.current.open();
  };

  return (
    <button className="story-form-button" onClick={handleButtonClick}>
      Upload image
    </button>
  );
};

const StoryForm = () => {
  isEditing();
  const [currentStory, setCurrentStory] = useState(null);
  const { dispatch } = useStoriesContext();
  const [title, setTitle] = useState('');
  const [children, setChildren] = useState([]);
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [state, setState] = useState('pending');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState('');
  const [selectedCheckTreeValuesTags, setSelectedCheckTreeValuesTags] = useState([]);
  const [selectedCheckTreeValuesChildren, setSelectedCheckTreeValuesChildren] = useState([]);
  const quillRef = useRef();
  const currentUser = localStorage.getItem("name");

  useEffect(() => {
    const fetchStoryById = async () => {
      if (editing === true) {
        const storyId = window.location.pathname.split('/')[2];
  
        if (storyId) {
          try {
            const response = await fetch(`/api/stories/${storyId}`);
            const json = await response.json();
  
            if (response.ok) {
              setCurrentStory(json);
              setTitle(json.title); // Set the title to the title of the current story
            } else {
              console.error(`Error fetching story with ID ${storyId}:`, json);
            }
          } catch (error) {
            console.error(`Error fetching story with ID ${storyId}:`, error);
          }
        }
      }
    };
  
    fetchStoryById();
  }, []);
  
  const handleImageUpload = imageUrl => {
    setContent(content + `\n<img src="${imageUrl}" alt="uploaded" />\n`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure that children is always an array of objects
    const childrenArray = Array.isArray(children) ? children : [{ value: children }];
  
    const childrenString = childrenArray.map((child) => child.value).join(',');
    const tagsString = tags;
    const story = {
      title,
      children: childrenString,
      tags: tagsString,
      content,
      categories: selectedCategories.join(','),
      author: currentUser,
      state,
    };
  
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        body: JSON.stringify(story),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const json = await response.json();
  
      if (!response.ok) {
        alert(json.error);
      }
  
      if (response.ok) {
        setTitle('');
        setChildren([]);
        setTags('');
        setContent('');
        setState('');
        setSelectedCategories([]);
        setError(null);
        console.log('New Story Posted', json);
        dispatch({ type: 'CREATE_STORY', payload: json });

        alert("Story Posted!");
        setTimeout(function() {
          window.location.href = '/stories';
      }, 1);
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      setError('An error occurred while submitting the form.');
    }
  };
  
  useEffect(() => {
    if (quillRef.current) {
      // Additional setup or handling can be added here
    }
  }, []);

  const handleCheckTreePickerChangeTags = (values) => {
    setSelectedCheckTreeValuesTags(values);

    // Convert selected values to a single comma-separated string
    const tagsString = Array.isArray(values) ? values.join('|') : '';
    setTags(tagsString);
  };

  const handleCheckTreePickerChangeChildren = (values) => {
    setSelectedCheckTreeValuesChildren(values);

    // Convert selected values to a single comma-separated string
    const childrenString = Array.isArray(values) ? values.join(',') : '';
    setChildren(childrenString);
  };

  if (!currentStory && isEditing === true) {
    return null;
  }
  else {
    return (
      <body className="story-form">
        <form className="create-story" onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              className="short-input"
              placeholder={"Story title..."}
              type="text"
              onChange={(e) => setTitle(e.target.value)}
            />
            <span className="author-input" readOnly>
              Author: {getName(currentUser)}
            </span>
          </div>
  
          <CheckTreePicker className="check-tree"
            placeholder="Add children to this story..."
            data={StudentList()}
            uncheckableItemValues={['1-1', '1-1-2']}
            value={selectedCheckTreeValuesChildren}
            onChange={handleCheckTreePickerChangeChildren}
            cascade={false}
            style={{ width: 660 }}
          />
          
          <CheckTreePicker
            className="check-tree2"
            placeholder="Learning tags..."
            data={groupedTags}
            uncheckableItemValues={['1', '2', '3', '4']}
            value={selectedCheckTreeValuesTags}
            onChange={handleCheckTreePickerChangeTags}
            cascade={false}
            style={{ width: 660 }}
            renderMenu={(menu) => (
              <div style={{ maxWidth: 'calc(100vh - 100px)'}}>
                {menu}
              </div>
            )}
          />
  
          <UploadWidget onImageUpload={handleImageUpload} />
  
          <div className="quill">
            <ReactQuill
              ref={quillRef}
              placeholder="Start writing..."
              onChange={(value) => setContent(value)}
              value={content}
              modules={{
                toolbar: {
                  container: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['clean']
                  ],
                },
              }}
              style={{ height: 'calc(100vh - 280px)' }}
            />
          </div>
  
          <div className="centered-button">
            <button className="story-form-button">Post Story</button>
          </div>
          {error && <div className="error">{error}</div>}
        </form>
      </body>
    );
  };
  }
  export default StoryForm;
  