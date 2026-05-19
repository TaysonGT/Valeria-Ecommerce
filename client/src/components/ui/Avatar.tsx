import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = '', 
  size = 'md',
  className = '',
  children
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  if (src) {
    return (
      <img
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
        src={src}
        alt={alt}
      />
    );
  }

  return (
    <div 
      className={`rounded-full bg-gray-200 flex items-center justify-center text-gray-600 ${sizeClasses[size]} ${className}`}
    >
      {children || (
        <svg 
          className="w-3/4 h-3/4" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 3.58-8 8h16c0-4.42-3.58-8-8-8z" />
        </svg>
      )}
    </div>
  );
};