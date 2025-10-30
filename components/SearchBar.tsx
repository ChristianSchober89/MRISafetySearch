
import React from 'react';
import { IconSearch } from './icons';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSubmit, isLoading }) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-grow">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="e.g., Medtronic Pacemaker, Aneurysm Clip..."
          className="w-full pl-4 pr-10 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-DEFAULT focus:outline-none transition duration-200"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center px-5 py-3 bg-brand-DEFAULT text-white font-semibold rounded-lg shadow-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-DEFAULT focus:ring-offset-white dark:focus:ring-offset-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition duration-200"
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <IconSearch className="w-5 h-5" />
        )}
        <span className="hidden sm:inline ml-2">Search</span>
      </button>
    </form>
  );
};
