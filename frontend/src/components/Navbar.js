import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../home.css";
import { FaHome, FaBook, FaChalkboard, FaSearch, FaTimes,FaUserPlus } from 'react-icons/fa';

const Navbar = (props) => {
    const location = useLocation(); // This hook gives us the current location object
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
        pageTitle = "Class Management";
    } else {
        switch (location.pathname) {
            case "/home":
                pageTitle = "";
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
            case "/pending":
                pageTitle = "Pending Stories";
                break;
            case "/manage_accounts":
                pageTitle = "Manage Accounts";
                break;
            case "/invite_family":
                pageTitle = "Invite Family";
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
                <Link to="/home" className="nav-logo">
                    <h1 className="nav-h1">{pageTitle}</h1>
                </Link>
                <div className="nav-links">
                    <Link to="/home" className={isActive("/home")}>
                        <FaHome className="nav-icon" /> Home
                    </Link>
                    {
                        ["Admin", "Teacher", "Parent"].includes(props?.role) &&

                        <Link to="/stories" className={isActive("/stories")}>
                            <FaBook className="nav-icon" /> Stories
                        </Link>
                    }
                    {

                        ["Admin", "Teacher"].includes(props?.role) &&
                        <>
                            <Link to="/class" className={isActive("/class")}>
                                <FaChalkboard className="nav-icon" /> Class
                            </Link>
                            <Link to="/search" className={isActive("/search")}>
                                <FaSearch className="nav-icon" /> Search Stories
                            </Link>
                        </>
                    }
                    {
                        ["Admin"].includes(props?.role) &&
                        <Link to="/manage_accounts" className={isActive("/manage_accounts")}>
                            <FaUserCircle className="nav-icon" /> Manage Accounts
                        </Link>
                    }
{
    ["Parent"].includes(props?.role) &&
    <>
        <Link to="/invite_family" className={isActive("/invite_family")}>
            <FaUserPlus className="nav-icon" /> Invite Family
        </Link>
        <Link to="/search" className={isActive("/search")}>
            <FaSearch className="nav-icon" /> Search Stories
        </Link>
    </>
}
                    <Link to="/logout" onClick={logoutHandler} className="nav-item">
                        <FaTimes
                            className="nav-icon" /> Logout
                    </Link>

                </div>
            </nav>
        </header>
    );
};

export default Navbar;
