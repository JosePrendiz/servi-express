import SearchBar from '@/components/search/searchBar';
import HandymanCard from '@/components/cards/handymanCard';

export default function Home() {
  const handymen = [
    {
      name: 'Juan Perez',
      location: 'Bogotá, Colombia',
      skills: ['Plomería', 'Carpintería', 'Electricidad'],
      rating: 4.5,
      image: `https://api.dicebear.com/9.x/pixel-art/svg?seed='JuanPerez'`
    },
    {
      name: 'Carlos Gómez',
      location: 'Medellín, Colombia',
      skills: ['Pintura', 'Jardinería'],
      rating: 4.7,
      image: `https://api.dicebear.com/9.x/pixel-art/svg?seed='CarlosGómez'`
    },
    {
      name: 'Ana Martínez',
      location: 'Cali, Colombia',
      skills: ['Limpieza', 'Organización'],
      rating: 4.8,
      image: `https://api.dicebear.com/9.x/pixel-art/svg?seed=AnaMartínez`
    },
    {
      name: 'Luis Rodríguez',
      location: 'Cartagena, Colombia',
      skills: ['Electricidad', 'Mecánico'],
      rating: 4.6,
      image: `https://api.dicebear.com/9.x/pixel-art/svg?seed=LuisRodríguez`
    },
    {
      name: 'María López',
      location: 'Barranquilla, Colombia',
      skills: ['Niñera', 'Cocina'],
      rating: 4.9,
      image: `https://api.dicebear.com/9.x/pixel-art/svg?seed='MaríaLópez'`
    },
    {
      name: 'Jorge Ramírez',
      location: 'Manizales, Colombia',
      skills: ['Fontanería', 'Carpintería'],
      rating: 4.4,
      image: `https://api.dicebear.com/9.x/pixel-art/svg?seed='JorgeRamírez'`
    },
    {
      name: 'Sofía Torres',
      location: 'Pereira, Colombia',
      skills: ['Decoración', 'Costura'],
      rating: 4.7,
      image: `https://api.dicebear.com/9.x/pixel-art/svg?seed='SofíaTorres'`
    },
    {
      name: 'Andrés Castro',
      location: 'Bucaramanga, Colombia',
      skills: ['Rep. de electrodomésticos', 'Cerrajería', 'Pedrero'],
      rating: 4.5,
      image: `https://api.dicebear.com/9.x/pixel-art/svg?seed='AndrésCastro'`
    },
    {
      name: 'Laura Morales',
      location: 'Santa Marta, Colombia',
      skills: ['Cuidado de mascotas', 'Limpieza'],
      rating: 4.8,
      image: `https://api.dicebear.com/9.x/pixel-art/svg?seed='LauraMorales'`
    },
    {
      name: 'Pedro Sánchez',
      location: 'Villavicencio, Colombia',
      skills: ['Construcción', 'Reparaciones generales'],
      rating: 4.6,
      image: `https://api.dicebear.com/9.x/pixel-art/svg?seed=PedroSánchez`
    },
  ]
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
