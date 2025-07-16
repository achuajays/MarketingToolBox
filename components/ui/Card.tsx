import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-4 sm:p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default Card;