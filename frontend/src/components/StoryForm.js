import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useStoriesContext } from "../hooks/useStoriesContext";
import { CheckTreePicker } from 'rsuite';
import '../index.css';
import { groupedTags } from "./docs/tags";
import StudentList from "./docs/StudentList";

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
  const { dispatch } = useStoriesContext();
  const [title, setTitle] = useState('');
  const [children, setChildren] = useState([]);
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState('');
  const [selectedCheckTreeValuesTags, setSelectedCheckTreeValuesTags] = useState([]);
  const [selectedCheckTreeValuesChildren, setSelectedCheckTreeValuesChildren] = useState([]);
  const quillRef = useRef();
  const currentUser = localStorage.getItem("name");

  const handleImageUpload = imageUrl => {
    setContent(content + `\n<img src="${imageUrl}" alt="uploaded" />\n`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure that children is always an array of objects
    const childrenArray = Array.isArray(children) ? children : [{ value: children }];
  
    const childrenString = childrenArray.map((child) => child.value).join(',');
    const tagsString = tags;
    const story = { title, children: childrenString, tags: tagsString, content, categories: selectedCategories.join(',') };
  
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
        setError(json.error);
      }
  
      if (response.ok) {
        setTitle('');
        setChildren([]);
        setTags('');
        setContent('');
        setSelectedCategories([]);
        setError(null);
        console.log('New Story Posted', json);
        dispatch({ type: 'CREATE_STORY', payload: json });
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
    const tagsString = Array.isArray(values) ? values.join(',') : '';
    setTags(tagsString);
  };

  const handleCheckTreePickerChangeChildren = (values) => {
    setSelectedCheckTreeValuesChildren(values);

    // Convert selected values to a single comma-separated string
    const childrenString = Array.isArray(values) ? values.join(',') : '';
    setChildren(childrenString);
  };

  return (
    <body className="story-form">
      <form className="create" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            className="short-input"
            placeholder="Story title..."
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <span className="author-input" readOnly>
            Author: {currentUser}
          </span>
        </div>

        <CheckTreePicker className="check-tree"
          placeholder="Add children to this story..."
          data={StudentList()}
          uncheckableItemValues={['1-1', '1-1-2']}
          value={selectedCheckTreeValuesChildren}
          onChange={handleCheckTreePickerChangeChildren}
          cascade={false}
          style={{ width: 600 }}
        />

        <CheckTreePicker className="check-tree2"
          placeholder="Learning tags..."
          data={groupedTags}
          uncheckableItemValues={['1-1', '1-1-2']}
          value={selectedCheckTreeValuesTags}
          onChange={handleCheckTreePickerChangeTags}
          cascade={false}
          style={{ width: 600 }}
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
            formats={[
              'header',
              'bold', 'italic', 'underline', 'strike',
              'blockquote',
              'list', 'bullet',
              'align',
              'color', 'background',
            ]}
            theme="snow"
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
