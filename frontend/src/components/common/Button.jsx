import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primaryDark shadow-sm px-6 py-2.5',
    secondary: 'bg-primaryLight text-primary hover:bg-primary hover:text-white px-4 py-2',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2',
    danger: 'bg-danger text-white hover:bg-red-600 px-4 py-2'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
