import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useStoriesContext } from "../hooks/useStoriesContext";
import { CheckTreePicker } from 'rsuite';
import '../index.css';
import { groupedTags } from "./docs/tags";
import StudentList from "./docs/StudentList";
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.2/dist/quill.snow.css" />

var editing = false;
var storyId;
var optimisedUrl


function isEditing() {
  if (window.location.pathname.includes('editstory')) {
    editing = true;
    storyId = window.location.pathname.split('/')[2];
  }
  else {
    editing = false;
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
      uploadPreset: 'tetlineq',
      sources: [ 'local '],
      clientAllowedFormats: ['image']
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

const UploadWidgetVideo = ({ onVideoUpload }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget({
      cloudName: 'drpnvb7qc',
      uploadPreset: 'tetlineq',
      sources: [ 'local '],
      clientAllowedFormats: ['video'],
      maxFileSize: 500000000
    }, function (error, result) {
      if (!error && result && result.event === "success") {
        let videoUrl = result.info.secure_url;
        let replacement = "f_auto:video,q_auto";
        optimisedUrl = videoUrl.replace(/(\/upload\/)[^/]+/, "$1" + replacement);
        onVideoUpload(optimisedUrl);
        console.log(optimisedUrl)
      }
    });
  }, [onVideoUpload]);

  const handleButtonClick = (e) => {
    e.preventDefault(); // Prevent the form from being submitted
    widgetRef.current.open();
  };

  return (
    <button className="story-form-button" onClick={handleButtonClick}>
      Upload Video
    </button>
  );
};


const StoryForm = () => {
  isEditing();
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
  const [currentUser, setUser] = useState(localStorage.getItem("name"));

  useEffect(() => {
    const fetchStoryById = async () => {
      if (editing === true) {
        const storyId = window.location.pathname.split('/')[2];

        if (storyId) {
          try {
            const response = await fetch(`/api/stories/${storyId}`);
            const json = await response.json();

            if (response.ok) {
              setTitle(json.title);
              setChildren(json.children ? json.children.split(',').map(child => child.trim()) : []);
              setContent(json.content);
              setUser(json.author);
              let tagsArray = (json.tags).split('|');
              let childrenArray = (json.children).split(',');

              handleCheckTreePickerChangeTags(tagsArray);
              handleCheckTreePickerChangeChildren(childrenArray);
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

  useEffect(() => {
    if (quillRef.current) {
      // Additional setup or handling can be added here
    }
  }, []);

  const handleCheckTreePickerChangeTags = (values) => {
    setSelectedCheckTreeValuesTags(values);
    const tagsString = Array.isArray(values) ? values.join('|') : '';
    setTags(tagsString);
  };

  const handleCheckTreePickerChangeChildren = (values) => {
    setSelectedCheckTreeValuesChildren(values);
    const childrenString = Array.isArray(values) ? values.join(',') : '';
    setChildren(childrenString);
  };

  const handleImageUpload = imageUrl => {
    console.log(imageUrl)
    if (imageUrl.includes("f_auto:video,q_auto"))
    {
      setContent(content + `\n<div id="upload-div">
      <div class="sub"></div><iframe
      title="test"
      src=${optimisedUrl}
      width="640"
      height="360" 
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      allowfullscreen
      frameborder="0"
    ></iframe></div>\n`);}
    else {
      setContent(content + `\n<div id="upload-div">
      <img src="${imageUrl}" align="center" alt="uploaded" />\n`);
    }   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    if (editing === true) {
      try {
        const response = await fetch(`/api/stories/${storyId}`, {
          method: 'PUT',
          body: JSON.stringify(story), // Include updated story data here
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        await response.json();
    
        if (!response.ok) {
          throw new Error(`Error updating story: ${response.statusText}`);
        }
    
        alert("Story Updated!");
        setTimeout(function() {
          window.location.href = `/pending/${storyId}`;
        }, 1);

      } catch (error) {
        console.error('Error updating story:', error);
      }
    }

    else {
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
    }
  };

  return (
    <body className="story-form">
      <form className="create-story" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            className="short-input"
            placeholder={"Story title..."}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <span className="author-input" readOnly>
            Author: {getName(currentUser)}
          </span>
        </div>

        <CheckTreePicker
          className="check-tree"
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
            <div style={{ maxWidth: 'calc(100vh - 100px)' }}>
              {menu}
            </div>
          )}
        />

        <UploadWidget onImageUpload={handleImageUpload} />
        <UploadWidgetVideo onVideoUpload={handleImageUpload} />

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
            style={{ height: '67vh' }}
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

export default StoryForm;
