import React, { useState } from 'react';
import './SearchLogs.css';
import LogSearch from './../../assets/LogSearch.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { fetchSearchResults } from '../../services/api'; // Adjust the import based on your project structure

export default function SearchLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [aiSummary, setAiSummary] = useState('');
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setAiSummary('');
    setSearchResults([]);
    setIsLoading(true);
    
    try {
      const data = await fetchSearchResults(searchQuery);
      
      // if (!response.ok) throw new Error('Search failed');
      console.log('Search results:', data);
      setSearchResults(data.results);
      setAiSummary(data.llm_answer || 'No summary available');
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setAiSummary('Error loading results');
    }
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Determine if we should center the search UI
  const shouldCenterSearch = searchResults.length === 0;

  return (
    <div className={`logo-search-container ${shouldCenterSearch ? 'centered-search' : ''}`}>
      {/* Logo and Search Text */}
      <div className={`logo-search-header ${shouldCenterSearch ? 'centered-logo' : ''}`}>
        <img style={{width:'30vw'}} src={LogSearch} alt="Logo" className="logo-search-logo"/>
      </div>
      
      {/* Search Bar */}
      <div className={`logo-search-bar-container ${shouldCenterSearch ? 'centered-search-bar' : ''}`}>
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
      
      {/* Results Section - Only shown when there are results */}
      {searchResults.length > 0 && (
        <div className="logo-search-results-container">
          {/* Left Results Column */}
          <div className="logo-search-results-left">
            {searchResults.map((result, index) => (
              <div key={index} className="logo-search-result-item">
                <div className="logo-search-result-header">
                  <h2 className="logo-search-username">{result.name}</h2>
                  <span className="logo-search-date">
                    {new Date(result.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="logo-search-result-box">
                  <p className="logo-search-result-text">{result.content}</p>
                </div>
              </div>
            ))}
          </div>
          
          {aiSummary && (
            <div className="logo-search-results-right">
              <h2 className="logo-search-summary-title">AI summary</h2>
              <div className="logo-search-summary-box">
                <p className="logo-search-summary-text">
                  {aiSummary}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="logo-search-loading">Loading results...</div>
      )}
    </div>
  );
}
