import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useStoriesContext } from "../hooks/useStoriesContext";
import { CheckTreePicker } from 'rsuite';
import '../index.css';
import { groupedTags } from "./docs/tags";

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

  return (
    <button onClick={() => widgetRef.current.open()}>
      Upload Button
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
    <body>
      <UploadWidget onImageUpload={handleImageUpload} />
      <form className="create" onSubmit={handleSubmit}>

        <input className="short-input" placeholder="Story title..."
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <CheckTreePicker
          data={groupedTags}
          uncheckableItemValues={['1-1', '1-1-2']}
          value={selectedCheckTreeValuesChildren}
          onChange={handleCheckTreePickerChangeChildren}
          cascade={false}
          style={{ width: 220 }}
        />

        <CheckTreePicker
          data={groupedTags}
          uncheckableItemValues={['1-1', '1-1-2']}
          value={selectedCheckTreeValuesTags}
          onChange={handleCheckTreePickerChangeTags}
          cascade={false}
          style={{ width: 220 }}
        />

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
                ['clean'],
              ],
            },
          }}
        />

        <div className="centered-button">
          <button>Post Story</button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </body>
  );
};

export default StoryForm;
