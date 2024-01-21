import { Link } from 'react-router-dom'
function truncate(str, n){
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
  };



function removeTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
 
    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
    return str.replace(/(<([^>]+)>)/ig, '');
}
  

const StoryDetails = ({ story }) => {
    return (
        <Link className='story-link' to={`/story/${story._id}`} key={story._id}>
            <div className="story-card">
                <h4 className="story-h4">{truncate(removeTags(story.title), 30)}</h4>
                <p className="story-p">{truncate(removeTags(story.content), 60)}</p>
                <sub className="story-children">{story.children}</sub>
                <sub className="story-sub">{"Story shared by Author\n"+story.createdAt}</sub> 
            </div>
        </Link>
    )
    
}

export default StoryDetails