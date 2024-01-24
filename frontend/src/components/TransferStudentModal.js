import React, { useState, useContext } from 'react';
import { ClassesContext } from '../context/ClassesContext';

const TransferStudentModal = ({ students, currentClassId, onClose }) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [newClassId, setNewClassId] = useState('');
  const { classes, transferStudent } = useContext(ClassesContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await transferStudent(selectedStudent, currentClassId, newClassId);
    onClose(); // Close the modal after transfer
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          required
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.firstName} {student.lastName}
            </option>
          ))}
        </select>
        <select
          value={newClassId}
          onChange={(e) => setNewClassId(e.target.value)}
          required
        >
          <option value="">Select New Class</option>
          {classes.map((c) => (
            c.id !== currentClassId && <option key={c.id} value={c.id}>{c.className}</option>
          ))}
        </select>
        <button type="submit">Transfer</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default TransferStudentModal;
