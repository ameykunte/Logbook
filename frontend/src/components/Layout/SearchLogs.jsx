import React, { useState } from 'react';
import './SearchLogs.css';
import LogSearch from './../../assets/LogSearch.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { fetchSearchResults } from '../../services/api'; // Adjust the import based on your project structure

export default function SearchLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('hybrid');
  const [isLoading, setIsLoading] = useState(false);
  const [allSearchResults, setAllSearchResults] = useState([]);
  const [aiSummary, setAiSummary] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const LOGS_PER_PAGE = 2;
  const MAX_LOGS = 15;
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setAiSummary('');
    setAllSearchResults([]);
    setIsLoading(true);
    setCurrentPage(1); // Reset to first page on new search
    
    try {
      const data = await fetchSearchResults(searchQuery, searchType);
      
      console.log('Search results:', data);
      const limitedResults = data.results.slice(0, MAX_LOGS);
      setAllSearchResults(limitedResults);
      setAiSummary(data.llm_answer || 'No summary available');
    } catch (error) {
      console.error('Search error:', error);
      setAllSearchResults([]);
      setAiSummary('Error loading results');
    }
    setIsLoading(false);
  };

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(allSearchResults.length / LOGS_PER_PAGE);
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Determine if we should center the search UI
  const shouldCenterSearch = allSearchResults.length === 0;
  
  // Get current page results
  const indexOfLastLog = currentPage * LOGS_PER_PAGE;
  const indexOfFirstLog = indexOfLastLog - LOGS_PER_PAGE;
  const currentResults = allSearchResults.slice(indexOfFirstLog, indexOfLastLog);
  
  // Calculate total pages
  const totalPages = Math.ceil(allSearchResults.length / LOGS_PER_PAGE);

  return (
    <div className={`logo-search-container ${shouldCenterSearch ? 'centered-search' : ''}`}>
      {/* Logo and Search Text */}
      <div className={`logo-search-header ${shouldCenterSearch ? 'centered-logo' : ''}`}>
        <img style={{width:'30vw'}} src={LogSearch} alt="Logo" className="logo-search-logo"/>
      </div>
      
      {/* Search Bar */}
      <div className={`logo-search-bar-container ${shouldCenterSearch ? 'centered-search-bar' : ''}`}>
      <select 
        className="search-type-dropdown"
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
      >
        <option value="hybrid">Hybrid</option>
        <option value="keyword">Keyword</option>
        <option value="semantic">Semantic</option>
      </select>
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
      {allSearchResults.length > 0 && (
        <div className="logo-search-results-container">
          {/* Left Results Column */}
          <div className="logo-search-results-left">
            {currentResults.map((result, index) => (
              <div key={indexOfFirstLog + index} className="logo-search-result-item">
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
            
            {/* Pagination Controls */}
            {allSearchResults.length > 0 && (
              <div className="logo-search-pagination">
                <button 
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                
                <div className="pagination-info">
                  <span>Page {currentPage} of {totalPages}</span>
                  <span className="pagination-total">({allSearchResults.length} results)</span>
                </div>
                
                <button 
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}
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