"use client"
import { SearchBarProps } from 'app/interfaces';
import { FaSearch } from 'react-icons/fa';
import React, { useState } from 'react';
import { usersAPI } from 'app/axios';

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (query) {
      const data = await usersAPI.searchHandymen(query)
      onSearch(data)
    } else {
      onSearch([])
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
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