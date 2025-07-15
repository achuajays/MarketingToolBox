
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants';

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
         <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v1h-1.5a.5.5 0 00-.5.5v1.5a.5.5 0 00.5.5H15v4.5a.5.5 0 00.5.5h1.5a.5.5 0 00.5-.5V5a2 2 0 012-2h-1.5a.5.5 0 00-.5.5v1.5a.5.5 0 00.5.5H19V16a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2h1.5a.5.5 0 00.5-.5V3a.5.5 0 00-.5-.5H3a2 2 0 01-2 2v11a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-1.5a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5H15a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
           </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-800">AI Toolkit</h1>
      </div>
      <nav className="flex flex-col gap-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          Dashboard
        </NavLink>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;