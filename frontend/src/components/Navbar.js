import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../home.css";

const Navbar = () => {
    const location = useLocation(); // This hook gives us the current location object
    const { classId } = useParams();
    let pageTitle;

    const logoutHandler = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("name");
        window.location.href = "/login";
    };

    // Function to check if the current path matches a dynamic route pattern
    const isDynamicRoute = (routePattern) => {
        const regex = new RegExp(routePattern);
        return regex.test(location.pathname);
    };

    // Determine the page title based on the current path
    if (isDynamicRoute("^/class/.+/addstudent$")) {
        pageTitle = "Add a New Student";
    } else if (isDynamicRoute("^/class/.+$")) {
        pageTitle = "Class: " + classId;
    } else {
        switch (location.pathname) {
            case "/home":
                pageTitle = "Goldfields School";
                break;
            case "/stories":
                pageTitle = "Stories";
                break;
            case "/class":
                pageTitle = "Create a New Class";
                break;
            case "/search":
                pageTitle = "Search Stories";
                break;
            case "/createstory":
                pageTitle = "Create a New Story";
                break;
            // other static routes
            default:
                pageTitle = "Goldfields School"; // Fallback title
        }
    }
    const isActive = (path) => {
        return location.pathname === path ? "nav-item active" : "nav-item";
    };

    return (
        <header>
            <nav className="navbar">
                {/* Display the determined page title */}
                <Link to="/" className="nav-logo">
                    <h1>{pageTitle}</h1>
                </Link>
                <div className="nav-links">
                    <Link to="/home" className={isActive("/home")}>
                        Home
                    </Link>
                    <Link to="/stories" className={isActive("/stories")}>
                        Stories
                    </Link>
                    <Link to="/class" className={isActive("/class")}>
                        Class
                    </Link>
                    <Link to="/search" className={isActive("/search")}>
                        Search Stories
                    </Link>
                    <Link to="/logout" onClick={logoutHandler} className="nav-item">
                        Logout
                    </Link>
                    <FaUserCircle className="nav-icon" />
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
