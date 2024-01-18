import React, { createContext, useState, useEffect } from 'react';

export const ClassesContext = createContext();

export const ClassesProvider = ({ children }) => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // Fetch classes from the backend when the context provider mounts
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/classes');
        if (!response.ok) {
          throw new Error('HTTP error! status: ' + response.status);
        }
        const data = await response.json();
        setClasses(data);
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

  return (
    <ClassesContext.Provider value={{ classes, addClass }}>
      {children}
    </ClassesContext.Provider>
  );
};
