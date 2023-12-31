import { useState } from "react"

const StoryForm = () => {
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState('')
    const [content, setContent] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        const story = {title, tags, content}

        const response = await fetch('/api/stories', {
            method: 'POST',
            body: JSON.stringify(story),
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
        }
        if (response.ok) {
            setTitle('')
            setTags('')
            setContent('')
            setError(null)
            console.log('New Story Posted')
        }
    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Create a new Story</h3>
            
            <label>Story Title:</label>
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />

            <label>Tags:</label>
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
    )
}

export default StoryForm