import React, { createContext, useState, useEffect } from "react";

export const ClassesContext = createContext();

export const ClassesProvider = ({ children }) => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // Fetch classes from the backend when the context provider mounts
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/classes");
        if (!response.ok) {
          throw new Error("HTTP error! status: " + response.status);
        }
        const data = await response.json();
        // Ensure each class has a students array
        const classesWithStudents = data.map((c) => ({
          ...c,
          students: c.students || [],
        }));
        setClasses(classesWithStudents);
      } catch (error) {
        console.error("Could not fetch classes:", error);
      }
    };

    fetchClasses();
  }, []);

  const addClass = async (newClass) => {
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClass),
      });
      const addedClass = await response.json();
      setClasses(prevClasses => [...prevClasses, addedClass]);
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  // Updated to handle new student object with image upload
  const addStudentToClass = async (classId, student) => {
    try {
      const formData = new FormData();
      for (const key in student) {
        if (key === 'image' && student[key]) {
          formData.append(key, student[key]);
        } else {
          formData.append(key, String(student[key])); // Ensure non-file values are converted to strings
        }
      }
      const response = await fetch(`/api/classes/${classId}/students`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status);
      }
      const updatedClass = await response.json();
      setClasses((prevClasses) =>
        prevClasses.map((c) =>
          c.id === classId
            ? { ...c, students: updatedClass.students }
            : c
        )
      );
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  return (
    <ClassesContext.Provider value={{ classes, addClass, addStudentToClass }}>
      {children}
    </ClassesContext.Provider>
  );
};
