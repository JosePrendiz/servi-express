'use client'
import { useState, useEffect } from 'react';
import SearchBar from '@/components/search/searchBar';
import HandymanCard from '@/components/cards/handymanCard';
import { handymenAPI } from './axios'

export default function Home() {
  const [handymen, setHandymen] = useState([]);

  useEffect(() => {
    const fetchHandymen = async () => {
      try {
        const response = await handymenAPI.getAllHandymen({
          page: 1,
          limit: 20,
          skills: [],
          coverageArea: [],
        });
        setHandymen(response || []);
      } catch (err) {
        console.error(err);         
      }
    };
    fetchHandymen();
  }, []);

  return (
    <div>
      <SearchBar />
      <h2 className="text-center">Nuestros Mejores Handymen</h2>
      <div className="handymen-grid">
        {handymen.map((handyman, index) => (
          <HandymanCard key={index} handymanData={handyman} />
        ))}
      </div>
    </div>
  );
}
