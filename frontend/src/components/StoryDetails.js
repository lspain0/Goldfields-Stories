import { Link } from 'react-router-dom'
function truncate(str, n){
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
  };

//format date
const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-UK', options);

    return formattedDate;
};

//remove html tags from content
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

//check if the story has more than 1 child, replace text with group story
function checkGroupStory(str) {
    if (str.includes(',')) {
        str = "Group Story";
    }
    else {
        str = "Story for "+str;
    }

    return str;
    
}

//return first name only with capitalised first letter
function getAuthorFirstName(str) {
    str = str.split(' ')[0];
    return str.charAt(0).toUpperCase() + str.slice(1);
}
  

const StoryDetails = ({ story }) => {
    return (
        <Link className='story-link' to={`/story/${story._id}`} key={story._id}>
            <div className="story-card">
                <sub className="story-children">{checkGroupStory(story.children)}</sub>
                <h4 className="story-h4">{truncate(removeTags(story.title), 30)}</h4>
                <p className="story-p">{truncate(removeTags(story.content), 60)}</p>
                <sub className="story-sub">{"Story shared by "+getAuthorFirstName(story.author)+"\n"}</sub> 
                <sub className='story-date'>{formatTimestamp(story.createdAt)}</sub>
            </div>
        </Link>
    )
    
}

export default StoryDetails