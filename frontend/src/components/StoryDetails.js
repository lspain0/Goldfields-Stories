const StoryDetails = ({ story }) => {
    return (
        <div className="story-details">
            <h4>{story.title}</h4>
            <p><strong>Tags: </strong>{story.tags}</p>
            <p>{story.content}</p>
            <p>{story.createdAt}</p>
        </div>
    )
}

export default StoryDetails