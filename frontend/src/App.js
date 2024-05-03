import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClassesProvider } from './context/ClassesContext';
import ClassesList from './components/ClassesList';
import ClassDetails from './pages/ClassDetails';
import Stories from './pages/Stories';
import PendingStories from './pages/PendingStories';
import Class from './pages/Class';
import Navbar from './components/Navbar';
import CreateStory from './pages/stories/CreateStory';
import AddStudentPage from './pages/AddStudentPage';
import StoryPage from './pages/StoryPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useEffect, useState } from 'react';
import axios from './axios';
import NavbarLogin from './components/NavbarLogin';
import EditStudentPage from './pages/EditStudentPage';
import Home from "./pages/Home";
import User from './pages/User';
import CreateFamilyStory from './pages/CreateFamilyStory';
import SearchStories from './pages/SearchStories';
import InviteFamily from './pages/inviteFamily';
import StudentDetail from './pages/StudentDetail';

function App() {

  const [role, setRole] = useState("");

  //Check if user is logged in or not
  const [login, setLogin] = useState(false);
  useEffect(() => {

    const currentRoute = window.location.pathname;

    async function checkValidity() {
      try {

        const yourApiEndpoint = "/users/checkValidity"
        //Getting token from localsotrage
        let token = localStorage.getItem("token");
        if (token) {

          //if token exist then it will send request validity
          const response = await axios.get(yourApiEndpoint, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the "Authorization" header
              // Add other headers as needed
            },
          });
          localStorage.setItem("role", response?.data?.role);
          setRole(response?.data?.role);
          setLogin(true);
        }
        else {
          //else if statement when no token then it will redirect to login page
          if (!currentRoute?.includes("/login"))
            window.location.href = "/login";
        }
      }
      catch (ex) {
        if (!currentRoute?.includes("/login"))

          window.location.href = "/login";
      }
    }
    checkValidity();
  }, []);
  if (login) {
    return (
      <ClassesProvider>
        <div className="App">
          <BrowserRouter>
            <Navbar role={role} />
            <div className="pages">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/stories" element={<Stories />} />
                <Route path="/pending" element={<PendingStories />} />
                <Route path="/class" element={<Class />} />
                <Route path="/createstory" element={<CreateStory />} />
                <Route path="/editstory/:storyid" element={<CreateStory />} />
                <Route path="/classeslist" element={<ClassesList />} />
                <Route path="/class/:classId" element={<ClassDetails />} />
                <Route path="/class/:classId/addstudent" element={<AddStudentPage />} />
                <Route path="/stories/:storyid" element={<StoryPage />} />
                <Route path="/pending/:storyid" element={<StoryPage />} />
                <Route path="/class/:classId/editstudent/:studentId" element={<EditStudentPage />} />
                <Route path="/manage_accounts" element={<User />} />
                <Route path="/home" element={<Home />} />
                <Route path="/createfamilystory" element={<CreateFamilyStory />} />
                <Route path="/search" element={<SearchStories />} />
                <Route path="/invite_family" element={<InviteFamily />} />
                <Route path="/class/:classId/student/:studentId" element={<StudentDetail />} />

              </Routes>
            </div>
          </BrowserRouter>
        </div>
      </ClassesProvider>
    );
  }
  else {
    return (
      <ClassesProvider>
        <div className="App">
          <BrowserRouter>
            <NavbarLogin />
            <div className="pages">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </div>
          </BrowserRouter>
        </div>
      </ClassesProvider>
    );
  }

}

export default App;
