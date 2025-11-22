import React from 'react';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = ''
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        width: '100%',
        padding: '12px 16px',
        backgroundColor: disabled ? '#9ca3af' : '#000000',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        fontFamily: 'Outfit, sans-serif',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s ease'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#374151';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#000000';
        }
      }}
    >
      {children}
    </button>
  );
};

export default CustomButton;