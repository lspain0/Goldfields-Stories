function truncate(str, n){
    return (str.length > n) ? str.slice(0, n-1) + '&hellip;' : str;
  };
  

const StoryDetails = ({ story }) => {
    return (
        <div className="story-card">
            <h4 className="story-h4">{story.title}</h4>
            <p className="story-p"><strong>Tags: </strong>{story.tags}</p>
            <p className="story-p">{truncate(story.content, 60)}</p>
            <p className="story-p">{story.children}</p>
            <p className="story-p">{story.createdAt}</p>
        </div>
    )
    
}

export default StoryDetails