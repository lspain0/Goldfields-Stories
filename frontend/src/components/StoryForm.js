import React, { useState, useRef, useEffect } from "react";
import Select, { components } from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useStoriesContext } from "../hooks/useStoriesContext";
import { CheckTreePicker } from 'rsuite'; // Import CheckTreePicker
import '../index.css';
import { groupedOptions } from "./docs/data";
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

const handleHeaderClick = id => {
  const node = document.querySelector(`#${id}`).parentElement
    .nextElementSibling;
  const classes = node.classList;
  if (classes.contains("collapsed")) {
    node.classList.remove("collapsed");
  } else {
    node.classList.add("collapsed");
  }
};

const CustomGroupHeading = props => {
  return (
    <div
      className="group-heading-wrapper"
      onClick={() => handleHeaderClick(props.id)}
    >
      <components.GroupHeading {...props} />
    </div>
  );
};

const StoryForm = () => {
  const { dispatch } = useStoriesContext();
  const [title, setTitle] = useState('');
  const [children, setChildren] = useState([]);
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]); // Add state for categories
  const [error, setError] = useState('');
  const quillRef = useRef();

  const handleImageUpload = imageUrl => {
    setContent(content + `\n<img src="${imageUrl}" alt="uploaded" />\n`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const childrenString = children.map((child) => child.value).join(',');
    const tagsString = tags.map((tag) => tag.value).join(',');
    const story = { title, children: childrenString, tags: tagsString, content, categories: selectedCategories.join(',') }; // Include categories in the story object

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
        setTags([]);
        setContent('');
        setSelectedCategories([]); // Reset selected categories
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

  return (
    <body>
      <UploadWidget onImageUpload={handleImageUpload} />
      <form className="create" onSubmit={handleSubmit}>

        <input className="short-input" placeholder="Story title..."
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <Select className="short-select" placeholder="Children in this story..."
          isMulti
          blurInputOnSelect={false}
          closeMenuOnSelect={false}
          options={[
            { value: 'child1', label: 'Child 1' },
            { value: 'child2', label: 'Child 2' },
          ]}
          onChange={(selectedOptions) => setChildren(selectedOptions)}
          value={children}
          isSearchable
        />

        <Select className="short-select" placeholder="Learning tags..."
          options={groupedOptions}
          isMulti
          blurInputOnSelect={false}
          closeMenuOnSelect={false}
          components={{ GroupHeading: CustomGroupHeading }}
          onChange={(selectedOptions) => setTags(selectedOptions)}
          value={tags}
        />

        <CheckTreePicker
          data={groupedTags}
          uncheckableItemValues={['1-1', '1-1-2']}
          defaultValue={[24]}
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
