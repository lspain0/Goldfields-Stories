import { Link } from 'react-router-dom'

//truncate story content
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

    var domParser = new DOMParser();
    var docElement = domParser.parseFromString(story.content, "text/html").documentElement;
    var imgTags = docElement.getElementsByTagName("img");
    const images = [];

    // Loop through each <img> tag and extract the image file name
    for (var i = 0; i < imgTags.length; i++) {
        var imgTag = imgTags[i];
        var imgSrc = imgTag.src;

        images[i] = imgSrc;
        
    }

    if (images.length === 0) {
        images[0] = './goldfieldslogo.png'
        
    }
    return (
        <Link className='story-link' to={`/stories/${story._id}`} key={story._id}>
            <div className="story-card">
                <div className="image-container">
                    <img src={images[0]} alt=""/>
                </div>
                <sub className="story-children">{checkGroupStory(story.children)}</sub>
                <h4 className="story-h4">{truncate(removeTags(story.title), 65)}</h4>
                <p className="story-p">{truncate(removeTags(story.content), 60)}</p>
                <sub className="story-sub">{"Story shared by "+getAuthorFirstName(story.author)+"\n"}</sub> 
                <sub className='story-date'>{formatTimestamp(story.createdAt)}</sub>
            </div>
        </Link>
    )
}

export default StoryDetails