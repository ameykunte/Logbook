import React, { useState } from 'react';
import './SearchLogs.css';
import LogSearch from './../../assets/LogSearch.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function SearchLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Hardcoded data
  const [searchResults, setSearchResults] = useState([
    {
      username: 'vamsee',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris'
    },
    {
      username: 'sudhan',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris'
    },
    {
      username: 'rahul',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris'
    }
  ]);
  
  const [aiSummary, setAiSummary] = useState(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris'
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // You could filter or change the hardcoded results based on the search query
      // For now, we'll just use the same data
      setIsLoading(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="logo-search-container">
      {/* Logo and Search Text */}
      <div className="logo-search-header">
        {/* <div className="logo-search-logo-box">
          लोगो
        </div>
        <div className="logo-search-title">Search</div>
        <div className="logo-search-icon-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div> */}
        <img style={{width:'30vw'}} src={LogSearch} alt="Logo" className="logo-search-logo"/>
      </div>
      
      {/* Search Bar */}
      <div className="logo-search-bar-container">
        <input
          type="text"
          placeholder="Search"
          className="logo-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button 
          className="logo-search-button"
          onClick={handleSearch}
        >
        <FontAwesomeIcon icon={faMagnifyingGlass} size="2xl" />
        </button>
      </div>
      
      {/* Results Section - Always shown with hardcoded data */}
      <div className="logo-search-results-container">
        {/* Left Results Column */}
        <div className="logo-search-results-left">
          {searchResults.map((result, index) => (
            <div key={index} className="logo-search-result-item">
              <h2 className="logo-search-username">{result.username}</h2>
              <div className="logo-search-result-box">
                <p className="logo-search-result-text">{result.text}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Right AI Summary Column */}
        <div className="logo-search-summary-column">
          <h2 className="logo-search-summary-title">AI summary</h2>
          <div className="logo-search-summary-box">
            <p className="logo-search-summary-text">
              {aiSummary}
            </p>
          </div>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="logo-search-loading">Loading results...</div>
      )}
    </div>
  );
}