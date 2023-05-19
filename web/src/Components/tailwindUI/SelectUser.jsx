import React, { useState } from 'react';

const UserSelect = () => {
  const [selectedUser, setSelectedUser] = useState('');

  const handleChange = (event) => {
    setSelectedUser(event.target.value);
  };

  return (
    <div>
      <select value={selectedUser} onChange={handleChange}>
        {listOptions.map((option, i) => (
            <option key={i} value={option.name}>{option.name}</option>
        ))}
      </select>
      {selectedUser && <p>Usuario seleccionado: {selectedUser}</p>}
    </div>
  );
};

export default UserSelect;