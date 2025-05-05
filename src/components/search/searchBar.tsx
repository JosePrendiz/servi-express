"use client"
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query) {
      console.info('Searching for:', query);
    }
  };

  return (
    <div className="searchbar-container">
      <div className="searchbar">
        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar servicios (ejemplo: fontanero, carpintero)"
          className="search-input"
        />
        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="search-button"
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
}