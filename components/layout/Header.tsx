import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded-lg flex items-center justify-center text-indigo-600 flex-shrink-0">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">{title}</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default Header;