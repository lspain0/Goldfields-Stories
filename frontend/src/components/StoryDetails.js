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

function addSpace(str) {
    return str.replaceAll(',', (', '))
  }


const StoryDetails = ({ story, selectedRadioValue, selectedChildrenFilters, selectedTagFilters, currentState }) => {
    //values for selected story filters
    let storyTypeFilter = false;
    let childrenFilter = false;
    let tagFilter = false;

    const handleDeleteStory = async () => {
        if (window.confirm("Are you sure you want to delete this story?")) {
          try {
            const response = await fetch(`/api/stories/${story._id}`, {
              method: 'DELETE'
            });
      
            if (response.ok) {
              // Update state or perform any necessary actions upon successful update
              alert("Story Deleted!");
              setTimeout(function () {
                window.location.href = '/stories';
              }, 1);
      
            } else {
              const errorResponseText = await response.text();
              console.error(`Error deleting story with ID ${story._id}:`, errorResponseText);
            }
      
          } catch (error) {
            console.error(`Error deleting story with ID ${story._id}:`, error);
          }
        }
      };

    //only display stories that fit the filters
    if (window.location.href.includes('stories')) {
        
        //check what story types are filtered to
        if ((selectedRadioValue === "All") || (selectedRadioValue === "Individual" && !story.children.includes(',')) || (selectedRadioValue === "Group" && story.children.includes(','))) {
            storyTypeFilter = true;
        }

        //check if story contains children selected in filters
        let childrenSubstrings = story.children.split(",");
        let childrenKeywords = selectedChildrenFilters.split(',')

        for (let i = 0; i < childrenSubstrings.length; i++) {
            if (childrenKeywords.some(childrenKeyword => childrenSubstrings[i].includes(childrenKeyword))) {
                childrenFilter = true;
                break;
            }
        }

        //check if story contains children selected in filters
        let tagSubstrings = story.tags.split("|");
        let tagKeywords = selectedTagFilters.split(',')

        for (let i = 0; i < tagSubstrings.length; i++) {
            if (tagKeywords.some(tagKeyword => tagSubstrings[i].includes(tagKeyword))) {
                tagFilter = true;
                break;
            }
        }

    }
    //set values to true for pending story page so all stories are displayed
    else {
        storyTypeFilter = true;
        childrenFilter = true;
        tagFilter = true;
    }

    //used to create the link to the story view, can be either 'pending' or 'stories'
    var link = "";

    //the below if statements will check the current url to decide whether to show pending or approved stories
    //there is probably a better way to do this but it works

    //prevents approved stories from being displayed
    if (window.location.href.includes('pending'))
    {
        link = "pending";
        
        if (story.state !== 'pending')
        {
            return null;
        }
    }

    //prevents pending stories from being displayed
    else if (window.location.href.includes('stories') || window.location.href.includes('search') || window.location.href.includes('class'))
    {
        link = "stories";

        if (story.state === 'pending')
        {
            return null;
        }
    }

    //prevents family stories from being displayed
    if (currentState === 'family') {
        if (story.state !== 'family') {
            return null;
        }
    }
    else if (currentState === 'mystories')
    {
        if (story.author !== localStorage.getItem("name"))
        {
            return null;
        }
    }
    else if (!window.location.href.includes('sear')) {
        if (story.state === 'family') {
            return null;
        }
    }

    //parse the story content to extract the image file name
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

    //if there are no images in the story, display the default image
    if (images.length === 0) {
        images[0] = './goldfieldslogo.png'
        
    }
    
    //if the story fits the filters, display the story
    if (storyTypeFilter === true && childrenFilter === true && tagFilter === true) {
        if (story.state !== 'family') {
            return (
                <div>              
                    <div className="story-card">
                    {
                        ["Admin"].includes(localStorage.getItem('role')) &&
                
                        <select
                        className="story-actions-dropdown"
                        onChange={(e) => {
                            if (e.target.value === "delete") {
                                handleDeleteStory();
                            }
                        }}
                    >
                        <option value=""></option>
                        <option value="delete">Delete</option>
                    </select>
                        }
                <Link className='story-link' to={`/${link}/${story._id}`} key={story._id}>

                            <div className="image-container">
                                <img src={images[0]} alt=""/>
                            </div>
                            <sub className="story-children">{checkGroupStory(story.children)}</sub>
                            <h4 className="story-h4">{truncate(removeTags(story.title), 60)}</h4>
                            <p className="story-p">{truncate(removeTags(story.content), 60)}</p>
                            <sub className="story-sub">{"Shared by "+getAuthorFirstName(story.author)+"\n"}</sub> 
                            <sub className='story-date'>{formatTimestamp(story.createdAt)}</sub>
                            </Link>
                        </div>
                </div>
            )
        }
        else {
            return (
                <div>              
                <div className="story-card">
                {
                    ["Admin"].includes(localStorage.getItem('role')) &&
            
                    <select
                    className="story-actions-dropdown"
                    onChange={(e) => {
                        if (e.target.value === "delete") {
                            handleDeleteStory();
                        }
                    }}
                >
                    <option value=""></option>
                    <option value="delete">Delete</option>
                </select>
                    }
            <Link className='story-link' to={`/${link}/${story._id}`} key={story._id}>

            <div className="image-container">
                            <img src={images[0]} alt=""/>
                        </div>
                        <sub className="story-children">Family moment for {(truncate(addSpace(story.children), 20))}</sub>
                        <p className="story-p">{truncate(removeTags(story.content), 120)}</p>
                        <sub className="story-sub">{"Shared by "+getAuthorFirstName(story.author)+"\n"}</sub> 
                        <sub className='story-date'>{formatTimestamp(story.createdAt)}</sub>
                        </Link>
                    </div>
            </div>
        )
    }

    }
}

export default StoryDetails