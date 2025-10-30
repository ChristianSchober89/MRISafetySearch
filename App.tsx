
import React, { useState, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { fetchMRISafetyInfo } from './services/geminiService';
import type { SearchResult } from './types';
import { ShieldCheckIcon, BrainCircuitIcon } from './components/icons';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setError('Please enter an implant name to search.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSearchResult(null);

    try {
      const result = await fetchMRISafetyInfo(query);
      setSearchResult(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching data. Please check your connection and API key, then try again.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);
  
  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
          
          <header className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              <ShieldCheckIcon className="w-12 h-12 text-brand-DEFAULT" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                MRI Safety Search
              </h1>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Enter a medical implant to check its MRI safety information, powered by Gemini.
            </p>
          </header>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
            <SearchBar
              value={query}
              onChange={handleQueryChange}
              onSubmit={handleSearch}
              isLoading={isLoading}
            />
          </div>

          <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {searchResult && <ResultsDisplay result={searchResult} />}
            {!isLoading && !error && !searchResult && (
              <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-md">
                <BrainCircuitIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">Ready to Search</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                  Results will appear here. Try searching for "Aneurysm Clip" or "Stent".
                </p>
              </div>
            )}
          </div>
          
          <footer className="text-center mt-12">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                  Disclaimer: This tool is for informational purposes only and is not a substitute for professional medical advice. Always consult with qualified medical personnel and the device manufacturer's official documentation.
              </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
