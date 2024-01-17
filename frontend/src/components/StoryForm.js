import React, { useState } from "react";
import Select, { components } from "react-select";
import { useStoriesContext } from "../hooks/useStoriesContext";
import { tagOptions } from "./docs/data";
import '../index.css';

const HideGroupHeading = (props) => {
  return (
    <div
      className={`collapse-group-heading ${props.isCollapsed ? "collapsed-group" : ""}`}
      onClick={() => {
        const groupList = document.querySelector(`#${props.id}`).parentElement.parentElement;
        groupList.classList.toggle("collapsed-group");
        groupList.style.height = groupList.classList.contains("collapsed-group") ? "0" : "auto";
      }}
    >
      <components.GroupHeading {...props} />
    </div>
  );
};

const HideGroupMenuList = (props) => {
  const newChildren = React.Children.map(props.children, (child) => {
    if (child.type === components.Option || child.type === components.Group) {
      const isGroupCollapsed = props.selectProps.options.some(
        (group) => group.label === child.props.label && group.collapsed
      );

      return React.cloneElement(child, {
        className: `${child.props.className || ""} ${
          isGroupCollapsed ? "hidden-tag" : ""
        }`,
      });
    }
    return child;
  });

  return <components.MenuList {...props}>{newChildren}</components.MenuList>;
};




const StoryForm = () => {
  const { dispatch } = useStoriesContext();
  const [title, setTitle] = useState('');
  const [children, setChildren] = useState([]);
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert selected children to a comma-separated string
    const childrenString = children.map((child) => child.value).join(',');

    // Convert selected tags to a comma-separated string
    const tagsString = tags.map((tag) => tag.value).join(',');

    const story = { title, children: childrenString, tags: tagsString, content };

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        body: JSON.stringify(story),
        headers: {
          'Content-Type' : 'application/json'
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
        setError(null);
        console.log('New Story Posted', json);
        dispatch({ type: 'CREATE_STORY', payload: json });
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      setError('An error occurred while submitting the form.');
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Create a new Story</h3>

      <label>Story Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />

      <label>Children in this story:</label>
      <Select
        isMulti
        options={[
          { value: 'child1', label: 'Child 1' },
          { value: 'child2', label: 'Child 2' },
          // Add more options as needed
        ]}
        onChange={(selectedOptions) => setChildren(selectedOptions)}
        value={children}
        isSearchable
      />

      <br />

      <label>Learning Tags:</label>
      <Select
        isMulti   
        options={tagOptions}
        blurInputOnSelect={false}
        closeMenuOnSelect={false}
        components={{
          GroupHeading: HideGroupHeading,
          MenuList: HideGroupMenuList
        }}
        onChange={(selectedOptions) => setTags(selectedOptions)}
        value={tags}
        isSearchable
      />

      <br />

      <label>Story Content:</label>
      <textarea
        type="text"
        onChange={(e) => setContent(e.target.value)}
        value={content}
      />

      <div className="centered-button">
        <button>Post Story</button>
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default StoryForm;
