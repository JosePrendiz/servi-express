'use client';
import HandymanCard from '@/components/cards/handymanCard';
import SearchBar from '@/components/search/searchBar';
import { useState, useEffect } from 'react';
import Loading from '@/components/loader';
import { handymenAPI } from './axios';
import { HandymanData } from './interfaces';

export default function Home() {
  const [handymen, setHandymen] = useState<HandymanData[]>([]);
  const [resultHandymen, setResultHandymen] = useState<HandymanData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const ITEMS_PER_PAGE = 20;

  const fetchHandymen = async (page = 1) => {
    setLoading(true);
    try {
      const response = await handymenAPI.getAllHandymen({
        page,
        limit: ITEMS_PER_PAGE,
        skills: [],
        coverageArea: [],
      });
      setHandymen(response.docs || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setSearchedHandymen = (result: HandymanData[]) => {
    setResultHandymen(result);
  };

  useEffect(() => {
    fetchHandymen(currentPage);
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const displayedHandymen = resultHandymen.length > 0 ? resultHandymen : handymen;

  return (
    <div>
      <SearchBar onSearch={setSearchedHandymen} />
      {loading ? (
        <Loading message="Cargando handymen..." />
      ) : (
        <>
          <h2 className="text-center">
            {resultHandymen.length > 0 ? 'Handymen Encontrados' : 'Nuestros Mejores Handymen'}
          </h2>
          <div className="handymen-grid">
            {displayedHandymen.map((handyman, index) => (
              <HandymanCard key={index} handymanData={handyman} />
            ))}
          </div>
          {resultHandymen.length === 0 && (
            <div className="pagination-controls">
              <button onClick={handlePreviousPage} className="pagination-button" disabled={currentPage === 1}>Anterior</button>
              <span className="pagination-text">Página {currentPage} de {totalPages}</span>
              <button onClick={handleNextPage} className="pagination-button" disabled={currentPage === totalPages}>Siguiente</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
