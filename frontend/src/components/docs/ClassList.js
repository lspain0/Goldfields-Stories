import { useContext } from 'react';
import { ClassesContext } from '../../context/ClassesContext';

const ClassList = () => {
  const { classes } = useContext(ClassesContext);

  // Function to format classes
  const formatClasses = (classes) => {
    return classes.map((classEntry) => {
      const studentsNames = classEntry.students.map(student => `${student.firstName} ${student.lastName}`).join(', ');
      return {
        label: classEntry.className,
        value: studentsNames,
      };
    });
  };

  // Get the formatted classes
  const formattedClasses = formatClasses(classes);

  return formattedClasses;
};

export default ClassList;
