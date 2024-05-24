
Goldfields Student Information and Reporting System
========================================================================

Authors: Fahim Kaidawala,  Lucas Spain, Biju Bhattarai
========================================================================

------------------
Project Overview
------------------
The Goldfields Student Information & Reporting System is a custom web application designed to manage and report student information efficiently at the Goldfields Special Needs School. This system is developed to replace the existing StoryPark system, which lacks certain functionalities tailored to the school's specific needs.

### Features:
•	Student Profiles: Secure creation and management of individual student profiles.

•	Class Management: Facilitates the easy transition of student profiles between different classes.

•	Story Creation: Creation of stories with a title, students/classes, custom learning tags, and content. Also supports use of image and video uploads.

•	Story Management and Search: Allows searching for stories related to the school, filtering by individual or group stories, and sorting search results by date or title, with the ability to click on story cards to view detailed stories. There are also options for managing stories for administrators such as approving or editing pending stories and deletion of stories.

•	Home Page Features: Displays a rotating gallery of images showcasing school activities and events, with options to upload, hide, and delete images, along with a welcome message in both English and Māori.

•	Reporting System: Automated generation of detailed reports and assessments, which can be shared with parents and staff.

•	Secure Data Sharing: Ensures that student information, including photos, videos, and academic reports, can be securely shared among teachers and with parents.

•	Notification System: Alerts parents automatically about new updates or reports regarding their children.

## Technical Stack

•	Frontend: React.js

•	Backend: Node.js with Express.js

•	Database: MongoDB

•	Cloud Storage: Cloudinary

•	Development Tools: Visual Studio Code, GitHub

### Project Setup

ENV file: To connect to the database a .env file is required in the backend folder however this folder is not included in the GitHub repository, if you are taking over this project for Goldfields the .env file should be included in the code given in the handover documentation you have received. This file contains the specification of the port to run on as well as the MONGO_URI link.

Follow these steps to set up the project on your local machine:
1.	Clone the Repository: Go to https://github.com/lspain0/Goldfields-Stories/tree/main and clone the repository to your local machine.
2.	Install Backend Dependencies: Open a terminal, navigate to the backend directory by typing cd backend, and then install the necessary dependencies by running npm install.
3.	Install Frontend Dependencies: Open a second terminal, navigate to the frontend directory by typing cd frontend, and then install the necessary dependencies by running npm install.
4.	Run the Application: Start the application by running npm run dev the backend directory and npm start in the frontend directory through the terminal.

--------------------------------------
   LOG IN PAGE 
--------------------------------------
1.	Input email address in the email field.
2.	Input password in the password field.
3.	Click on “Sign In”, successful sign-in will take you to the home page.
4.	This page also includes a link on the top right to navigate to the “SIGNUP” Page.

--------------------------------------
  SIGNUP PAGE
--------------------------------------
1.	Click on the “Signup” button in the top right corner.
2.	Input Full Name with the first letter of first and last name being upper case and space between first and last name in the Full Name field.
3.	Input email address in the Email field.
4.	Input the desired password in the password field.
5.	Click on the “Sign Up” button that is coloured green.
6.	This page also includes a link on the top right to navigate to the LOGIN Page.


--------------------------------------
  HOME PAGE
--------------------------------------
1.	Once logged in, this takes you to the home page.
2.	The home page displays a banner with the Goldfields School logo and a rotating gallery of images showcasing various school activities and events.
3.	Below the banner, you have options to:
•	Upload Image: Add new images to the gallery by clicking on the "Upload Image" button.
•	Hide Images: Temporarily hide the image gallery by clicking on the "Hide Images" button.
4.	The image gallery features thumbnails of the uploaded images, each with a "Delete" button below it to remove unwanted images.
5.	The page includes a welcoming message in both English and Māori:
•	Māori: "I te puāwaitanga o te harakeke, he rito whakakī whārurua – When the flax blossoms, its many offspring begin their journey"
•	English: "Nau Mai, Haere Mai" which translates to "Welcome."
6.	Navigation options at the top right corner include:
•	Home: Return to the home page.
•	Stories: Access stories and updates related to the school.
•	Classes: View class information.
•	Search Stories: Search for specific stories.
•	Manage Accounts: Manage user accounts.
•	Invite Parent: Send invitations to parents to join the platform.

--------------------------------------
  STORIES PAGE
--------------------------------------
1.	This page can be accessed by clicking on “Stories” on the Navbar.

2.	This page will display a list of all stories available to the current logged in user, admins and teachers can see all stories, while parents will only be able to see stories which contain their child. Users can click on a story card to get navigate to the story view page where they will see a full view of the content of the story.

3.	An option at the top of the page allows the user to switch between education stories, family stories, and my stories. Education stories can only be created by admin and teacher users, while family stories can also be created by parent and family users. The “My Stories” tab will display stories created by the current user.

4.	Below this option is a row of buttons an option that will be slightly different for each role. This row contains a button to create a story, view pending stories, and sort the stories on the page. Parent and family users will only be able to see the sort options, unless they are on the family stories tab where they will be able to see the create story button. Only admins will be able to see the pending stories button if there are currently stories pending approval, this will also display the current number of pending stories.

5.	Admin users are also able to delete any story by hovering over the story card and clicking the trash icon in the top right corner.

--------------------------------------
  CREATE STORIES PAGE
--------------------------------------
This page can be accessed from the Stories page and clicking on the “Create a New Story” or “Create a New Family Story” button. The page will be slightly different depending on which button this is accessed with and what roles the user has, and family stories do not have options for a title, learning tags, or an option for class stories.

Creating a story:
1.	Select individual or class story from the top of the page.

2.	Enter a title, the students or classes you would like to include, and learning tags (optional).

3.	Enter the content of the story. There is also a toolbar that can be used for different size and text options.

4.	Upload an image or video (optional) - Click the upload image/video button, select the image/video from your computer and click done.

5.	Click post story – if all the required inputs are filled in, the story will be submitted to the MongoDB database, with the “pending” state. This means it can now be seen by administrators and will be visible to other users once it is approved.

6.	Admin users can also click on the “Edit Tags” button to update the list of learning tags that is available to all users. These tags are saved the MongoDB database.
The above instructions can be followed for family stories, however a title and learning tags will not be required, and users with parent or family roles will have the story automatically assigned to their child instead of selecting one.

--------------------------------------
STORY VIEW PAGE
--------------------------------------
1.	This page can be accessed by clicking on any story card on the “Stories” page.

2.	On the left of the page will be the title and entire content of the story, including uploaded images and videos. 

3.	On the right contains other information about the story, including the author, date, children, learning tags, and a comment box.

4.	Users can post a comment by entering text into the comment box and clicking the “Post” button. Their comment will then be added to the list of contents above the comment input box.

--------------------------------------
PENDING STORIES PAGE
--------------------------------------
1.	This page is similar to the Stories page however it is only accessible to admin users and only displays stories with the pending state.

2.	To access this page, first navigate to the Stories page using the Navigation bar, then click on the “Pending Stories” button. This button will only be visible if there are currently stories pending approval.

3.	The user can then click on any story card and will be taken to the story view page for this story.

4.	This page is the same as the story view page mentioned above. However, there is an additional admin control panel that contains options to post, edit or delete the story.

5.	Clicking the “Post Story” button will change the state of the story to “approved”, allowing all users with appropriate permissions to see the story on the stories page. 

6.	Clicking the “Edit Story” button will navigate to the story creation page and load the contents of the current story so that it can be edited.

7.	Clicking the “Delete Story” button will remove the current story from the database.

--------------------------------------
  CLASSES PAGE
--------------------------------------
1.	Once logged in, navigate to the "Classes" section using the navigation bar at the top of the page.
2.	The "Classes" page allows you to create and manage classes.
3.	To create a new class:

•	Enter the class name in the input field labeled "Class Name."

•	Click on the "Add Class" button to create the class.

4.	Below the class creation form, there is a section labeled "Created Classes" where all created classes are displayed as buttons.
5.	You can sort the list of created classes using the "Sort by" dropdown menu. Sorting options include:

•	Alphabetical: Sort classes in alphabetical order.

•	Recently Added: Sort classes by the date they were added, with the most recent first.

•	Oldest First: Sort classes by the date they were added, with the oldest first.


--------------------------------------
CREATE STUDENT PROFILE PAGE
--------------------------------------
1.	Once logged in, navigate to the "Classes" section and select a class to manage.
2.	To add a new student, click on the "Add Student" button, which will take you to the "Create Student Profile" page.
3.	The "Create Student Profile" page allows you to enter the details of the new student.
4.	Follow these steps to create a new student profile:

•	Upload Image: Click on the "Upload Image" button to add a profile picture for the student.

•	First Name: Enter the student's first name in the provided field.

•	Last Name: Enter the student's last name in the provided field.

•	Gender: Select the student's gender from the dropdown menu. Options include Male, Female, and Other.

•	Date of Birth: Enter the student's date of birth in the format dd/mm/yyyy.

5.	After filling in all the required fields, click on the "Add Student" button to save the student's profile.
6.	If you want to go back to the previous page without adding a new student, click the "Back" button.

--------------------------------------
CLASS MANAGEMENT PAGE
--------------------------------------
1.	Once logged in, navigate to the "Classes" section and select a class to manage.
2.	The "Class Management" page allows you to manage students within a selected class.
3.	At the top of the page, you have options to:

•	Add Student: Add a new student to the class.

•	Transfer Student: Transfer a student from the current class to another class. Use the "Select Student" dropdown to choose the student and the "Select New Class" dropdown to choose the destination class. Click "Transfer" to complete the action or "Cancel" to discard it.

•	Delete Class: Permanently delete the current class and all its associated data.

•	Back: Return to the previous page.

4.	The class name is displayed, followed by a section where the students in the class are listed. Each student is represented by a card showing their name, date of birth (DOB), and an image.
5.	You can sort the list of students using the "Sort by" dropdown menu. Sorting options include:

•	Alphabetical Order: Sort students in alphabetical order.

•	Recently Added: Sort students by the date they were added, with the most recent first.

•	Oldest First: Sort students by the date they were added, with the oldest first.

•	Youngest to Oldest: Sort students from youngest to oldest based on their DOB.

•	Oldest to Youngest: Sort students from oldest to youngest based on their DOB.

6.	Each student card has an "Actions" dropdown menu with the following options:

•	Edit: Modify the student's details.

•	Delete: Remove the student from the class.


--------------------------------------
STUDENT PROFILE PAGE
--------------------------------------
1.	Once logged in, navigate to the "Classes" section and select a class to manage.
2.	In the "Class Management" page, click on the student you wish to view. This will take you to the "Student Profile" page.
3.	The "Student Profile" page displays detailed information about the selected student:

•	Profile Picture: An image of the student.

•	Name: The student's full name.

•	Gender: The student's gender.

•	Date of Birth: The student's date of birth.

•	Parents: The names and email addresses of the student's parents.

4.	Below the student's profile information, there is a section displaying the stories related to the student. Each story is represented by a card showing an image, title, a brief description, the type of story, and the date it was shared.
5.	You can click on any story card to view the full story.
6.	Click the "Back" button to return to the previous page.

--------------------------------------
SEARCH STORIES PAGE
--------------------------------------
1.	Once logged in, navigate to the "Search Stories" section using the navigation bar at the top of the page.
2.	The "Search Stories" page allows you to search for stories related to the school.
3.	To search for a story:

•	Enter the search term in the search bar at the top of the page.

•	Use the dropdown menu to filter the stories by type:

•	All Stories: View all stories.

•	Individual Stories: View only individual stories.

•	Group Stories: View only group stories.

•	Use the "Sort by" dropdown menu to sort the stories:

•	Sort by Date: Sort stories by the date they were added, with the most recent first.

•	Sort by Title: Sort stories alphabetically by their title.

•	Click the "Search" button OR “Enter button on your keyboard” to execute the search.

4.	The search results will display as a gallery of story cards, each showing an image, title, a brief description, the type of story, and the date it was shared.
5.	You can click on any story card to view the full story.

--------------------------------------
MANAGE ACCOUNTS PAGE
--------------------------------------
1.	Once logged in, navigate to the “Manage Accounts” section using the navigation bar at the top of the page.
2.	The “Manage Accounts” page allows you to see all the accounts, change roles, assign a parent to a child, delete accounts and search accounts.
3.	To search a user:

•	Click on the “Search by Full Name” rectangular box.

•	Input either the first or last name of the account you wish to find.

•	Search results will only display matching name accounts.

4.	To change roles:

•	Follow the search a user step to locate the user you wish to change role.

•	Click the drop-down button under Change role for variation of role.

•	Admin: Highest management role, able to make changes of all content

•	Teacher: Second highest role, able to create stories and view classes

•	Parent: Able to view child’s stories only and to invite family members

•	Family: Only able to view child stories invited by the parent.

•	Select the role you want the user to have.

5.	To Assign to Child:

•	Follow step 3 to locate the user

•	Follow step 4 but select a parent role.

•	Select the child from the drop-down list.

6.	To delete an account.

•	Follow step 3 to find the account.

•	Click on the delete icon.

•	Click on ok on the pop-up screen to delete the account permanently.

--------------------------------------
  INVITE PARENTS PAGE
--------------------------------------
1.	Once logged in, navigate to the ‘Invite Parent’ section using the navigation bar at the top of the page.
2.	The invite parent page displays the Default Password to all future invited parents.
•	Input the default password you wish to set for future parents account.
•	To confirm the default password, click on “Change Password”
•	A popup message to confirm it has been updated.
3.	Input parents full name in the Full Name field.
4.	Input parents email address in the email field.
5.	Click on Create Account.
6.	Parent to login.

•	Parent then goes into Login screen.

•	Input email address in the email field

•	Input the default password in the password field, that has been set by the administrator

•	Clicks on Login.

•	Parent password change

•	Input the password in the rectangular empty box, different from the default password.

•	Click on “Change Password”

•	Pop up screen to confirm changes and logs you out

•	Input email address in the email field

•	Input the changed password in the password field

•	Click on “Login”
