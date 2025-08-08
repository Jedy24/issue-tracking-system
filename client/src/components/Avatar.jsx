import React from 'react';

const Avatar = ({ name, className = "" }) => {
  return (
    <div className={`flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm ${className}`}>
      {name}
    </div>
  );
};

export default Avatar;