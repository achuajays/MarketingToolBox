import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();

  return (
    <div className="h-full bg-white border-r border-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-slate-800">
            MarketingToolBox
          </h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          AI Content Creation Suite
        </p>
        <a
          href="https://www.producthunt.com/products/marketingtoolbox?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-marketingtoolbox"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=993237&theme=light&t=1752662006500"
            alt="MarketingToolBox - All Tools you need at one place | Product Hunt"
            style={{ width: 250, height: 54 }}
            width={250}
            height={54}
          />
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 sm:p-4">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className="text-xs text-slate-400 text-center">
          <p>Powered by AI</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
