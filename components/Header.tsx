
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-dark-surface p-4 shadow-md">
      <div className="container mx-auto flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary">
            <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
        </svg>
        <h1 className="text-2xl font-bold ml-3 text-dark-text-primary">
          Sales Forecast <span className="text-brand-primary">AI</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
