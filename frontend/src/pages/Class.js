import React, { useState, useContext, useEffect } from "react";
import Logo from "../components/logo";
import "../class.css";
import ClassForm from "../components/ClassForm.js";
import { ClassesContext } from "../context/ClassesContext";
import { Link } from "react-router-dom";

function Class() {
  const [className, setClassName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const { classes, addClass } = useContext(ClassesContext);
  const [sortMethod, setSortMethod] = useState("alphabetical"); 
  const [sortedClasses, setSortedClasses] = useState([]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert new class name to lowercase for case-insensitive comparison
    const newClassNameLower = className.toLowerCase();

    // Check for duplicate class name (case-insensitive)
    const isDuplicate = classes.some(
      (c) => c.className.toLowerCase() === newClassNameLower
    );
    if (isDuplicate) {
      setMessage(`Error: A class with the name '${className}' already exists.`);
      setIsSubmitting(false);
      return;
    }

    try {
      await addClass({ className });
      setMessage(`Class '${className}' created successfully.`);
      setClassName("");
    } catch (error) {
      console.error("Error creating class:", error);
      setMessage("Failed to create class. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    // Function to sort classes based on the selected method
    const sortClasses = (classes) => {
      switch (sortMethod) {
        case "alphabetical":
          return [...classes].sort((a, b) =>
            a.className.localeCompare(b.className)
          );
        case "recentlyAdded":
          return [...classes].sort((a, b) => 
            parseInt(b._id.substring(0, 8), 16) - parseInt(a._id.substring(0, 8), 16)
          );
        case "oldestFirst":
          return [...classes].sort((a, b) => 
            parseInt(a._id.substring(0, 8), 16) - parseInt(b._id.substring(0, 8), 16)
          );
        // Add more sorting options as needed
        default:
          return classes;
      }
    };

    const sorted = sortClasses(classes);
    setSortedClasses(sorted);
  }, [classes, sortMethod]); // Re-sort whenever classes or sortMethod changes
 
  // Function to handle sort method change
  const handleSortChange = (e) => {
    setSortMethod(e.target.value);
  };

  // Function to clear the message
  const clearMessage = () => {
    setMessage("");
  };

  return (
    <div className="class-page-container">
      <div className="logo-container">
        <Logo />
      </div>
      <div className="class-form-container">
        <ClassForm
          className={className}
          setClassName={setClassName}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
        />
          <div className="message-wrapper">
          {message && (
            <div className="message-container">
              <p>{message}</p>
              <button className="message-close-btn" onClick={clearMessage}>
                &times;
              </button>
            </div>
          )}
        </div>
        {/* Other content */}
      </div>
      <div className="classes-container">
        <div className="classes-header-container">
          <h3 className="class-form-h3">Created Classes</h3>
          <div className="sort-dropdown-container">
            <select className="sort-dropdown" onChange={handleSortChange} value={sortMethod}>
              <option value="alphabetical">Alphabetical</option>
              <option value="recentlyAdded">Recently Added</option>
              <option value="oldestFirst">Oldest First</option>
              {/* Add other options for sorting methods here */}
            </select>
          </div>
        </div>
        <div className="cards-container">
          {sortedClasses.length > 0 ? (
            sortedClasses.map((c, index) => (
              <Link to={`/class/${c.id}`} key={c.id} className="class-card">
                <span>{c.className}</span>
              </Link>
            ))
          ) : (
            <p>No classes created yet.</p>
          )}
        </div>
      </div>
    </div>
  );  
}

export default Class;
