//this file interacts with the classes on the mongodb database in order to retrieve a list of all students and format them to be used in a checklist

import { useContext } from 'react';
import { ClassesContext } from '../../context/ClassesContext';

const StudentList = () => {
  const { classes } = useContext(ClassesContext);

  // Function to format students in a way that can be used in a checklist
  const formatStudents = (students) => {
    return students.map((student) => ({
      label: `${student.firstName} ${student.lastName}`,
      value: `${student.firstName} ${student.lastName}`,
    }));
  };

  // Function to format all students from every class
  const formatAllStudents = () => {
    return classes.flatMap((classEntry) => {
      return formatStudents(classEntry.students);
    });
  };

  // Get the formatted students
  const formattedStudents = formatAllStudents();

  return formattedStudents;
};

export default StudentList;
