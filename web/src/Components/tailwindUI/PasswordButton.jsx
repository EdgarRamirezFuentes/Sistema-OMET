import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline';

const PasswordInput = ({val}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (event) => {
    setPassword(event.target.value);
    val(event.target.value)
  };

  return (
    <div className='mb-10 w-full flex flex-row justify-center'>
      <input
        className='w-1/2 my-2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600'
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={handleChange}
      />
      <div className='h-5 w-5 mt-5' onClick={handleTogglePassword}>
        {showPassword ? <EyeIcon/>:<EyeSlashIcon/>}
      </div>
    </div>
  );
};

PasswordInput.propTypes = {
    val: PropTypes.func
}

export default PasswordInput;
