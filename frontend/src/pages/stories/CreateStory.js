import React from "react";
import Logo from "../../components/logo";
import StoryForm from "../../components/StoryForm";

const CreateStory = () => {
    return (
        <body>
      <div className="home">
        <Logo />
      </div>
            <div className="StoryForm">
                <StoryForm />
            </div>
        </body>
    );
};

export default CreateStory;
