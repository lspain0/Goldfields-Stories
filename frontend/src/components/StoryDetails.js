function truncate(str, n){
    return (str.length > n) ? str.slice(0, n-1) + '&hellip;' : str;
  };
  

const StoryDetails = ({ story }) => {
    return (
        <div className="story-card">
            <h4 className="story-h4">{truncate(story.content, 30)}</h4>
            <p className="story-p">{truncate(story.content, 60)}</p>
            <sub className="story-children">{story.children}</sub>
            <sub className="story-sub">{"Story shared by Author\n"+story.createdAt}</sub>
        </div>
    )
    
}

export default StoryDetails