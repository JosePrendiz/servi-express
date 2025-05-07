'use client'
import HandymanCard from '@/components/cards/handymanCard';
import SearchBar from '@/components/search/searchBar';
import { useState, useEffect } from 'react';
import Loading from '@/components/loader';
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
        {handymen.length === 0 ? (
          <Loading message="Cargando handymen..." />
        ) : (
          handymen.map((handyman, index) => (
            <HandymanCard key={index} handymanData={handyman} />
          ))
        )}

      </div>
    </div>
  );
}
