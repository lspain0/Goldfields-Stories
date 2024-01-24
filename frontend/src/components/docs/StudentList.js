import React, { useContext } from 'react';
import { ClassesContext } from '../../context/ClassesContext';

const StudentList = () => {
  const { classes } = useContext(ClassesContext);

  // Function to format students
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
