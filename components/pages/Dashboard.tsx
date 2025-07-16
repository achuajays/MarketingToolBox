import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants';
import Card from '../ui/Card';
import Header from '../layout/Header';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Header 
        title="MarketingToolBox"
        subtitle="Your central hub for AI-powered content creation and optimization."
        icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {NAV_ITEMS.map((item) => (
          <Link to={item.path} key={item.path} className="block hover:scale-[1.02] transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-50 rounded-lg">
            <Card className="h-full flex flex-col justify-between !p-0 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-2">
                        <span className="text-indigo-600 flex-shrink-0">{item.icon}</span>
                        <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">{item.name}</h2>
                    </div>
                    <p className="text-slate-500 text-xs sm:text-sm">Launch the {item.name.toLowerCase()} tool.</p>
                </div>
                 <div className="bg-slate-100 text-indigo-600 text-xs font-semibold py-2 px-4 sm:px-6 text-right border-t border-slate-200">
                    Open Tool &rarr;
                </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;