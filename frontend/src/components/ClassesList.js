import React, { useContext } from 'react';
import { ClassesContext } from '../context/ClassesContext';

const ClassesList = () => {
  const { classes } = useContext(ClassesContext);

  if (classes.length === 0) {
    return <p>No classes have been created yet.</p>;
  }

  return (
    <div>
      <h2>Classes List</h2>
      <ul>
        {classes.map((c, index) => (
          <li key={index}>{`${c.className} - ${c.subject}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClassesList;
