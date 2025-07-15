
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center text-indigo-600">
          {icon}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-500 mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default Header;