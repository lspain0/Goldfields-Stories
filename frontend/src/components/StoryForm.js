import { useState } from "react";
import { useStoriesContext } from "../hooks/useStoriesContext";

const StoryForm = () => {
    const { dispatch } = useStoriesContext();
    const [title, setTitle] = useState('');
    const [children, setChildren] = useState('');
    const [tags, setTags] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const story = { title, children, tags, content };

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
            setChildren('');
            setTags('');
            setContent('');
            setError(null);
            console.log('New Story Posted', json);
            dispatch({ type: 'CREATE_STORY', payload: json });
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
            <input
                type="text"
                onChange={(e) => setChildren(e.target.value)}
                value={children}
            />

            <label>Learning Tags:</label>
            <input
                type="text"
                onChange={(e) => setTags(e.target.value)}
                value={tags}
            />

            <label>Story Content:</label>
            <textarea
                type="text"
                onChange={(e) => setContent(e.target.value)}
                value={content}
            />

            <button>Post Story</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default StoryForm;
