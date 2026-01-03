import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, DollarSign, TrendingUp, Plus, Eye, Edit2, Trash2, Share2 } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200',
      title: 'Plan Your Next Adventure',
      subtitle: 'Create personalized itineraries, manage budgets, and share your travel stories'
    },
    {
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200',
      title: 'Explore the World',
      subtitle: 'Discover amazing destinations and create unforgettable memories'
    },
    {
      url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200',
      title: 'Travel Made Simple',
      subtitle: 'Organize your trips effortlessly with our intelligent planning tools'
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);

  const regionalSelections = [
    { id: 1, name: 'Paris, France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', tag: 'Romantic', region: 'Europe' },
    { id: 2, name: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', tag: 'Cultural', region: 'Asia' },
    { id: 3, name: 'New York, USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', tag: 'Urban', region: 'Americas' },
    { id: 4, name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', tag: 'Tropical', region: 'Asia' },
    { id: 5, name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', tag: 'Luxury', region: 'Middle East' },
  ];

  const previousTrips = [
    { 
      id: 1, 
      name: 'European Adventure', 
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400',
      destinations: 5,
      duration: '14 days',
      budget: 3500,
      startDate: '2024-06-15',
      category: 'cultural'
    },
    { 
      id: 2, 
      name: 'Asian Expedition', 
      image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400',
      destinations: 3,
      duration: '10 days',
      budget: 2200,
      startDate: '2024-08-20',
      category: 'adventure'
    },
    { 
      id: 3, 
      name: 'Beach Paradise', 
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
      destinations: 2,
      duration: '7 days',
      budget: 1800,
      startDate: '2024-12-10',
      category: 'beach'
    },
  ];

  const filteredRegions = regionalSelections.filter(region => 
    region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    region.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrips = previousTrips
    .filter(trip => {
      const matchesSearch = trip.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || trip.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.startDate) - new Date(a.startDate);
      if (sortBy === 'oldest') return new Date(a.startDate) - new Date(b.startDate);
      if (sortBy === 'budget-high') return b.budget - a.budget;
      if (sortBy === 'budget-low') return a.budget - b.budget;
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#FDFFFC]">
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Hero Carousel */}
        <div className="relative mb-12 rounded-3xl overflow-hidden h-[400px] shadow-2xl">
          {carouselImages.map((slide, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: currentSlide === index ? 1 : 0 }}
            >
              <div className="absolute inset-0 bg-[#235789] opacity-85"></div>
              <img 
                src={slide.url} 
                alt={`Slide ${index + 1}`} 
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
            </div>
          ))}

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8">
            <h2 className="text-5xl font-bold text-[#FDFFFC] mb-4 drop-shadow-lg">
              {carouselImages[currentSlide].title}
            </h2>
            <p className="text-xl text-[#FDFFFC] mb-8 max-w-2xl opacity-95">
              {carouselImages[currentSlide].subtitle}
            </p>
            <button 
              onClick={() => navigate('/create-trip')}
              className="flex items-center gap-2 px-8 py-4 bg-[#FDFFFC] text-[#235789] rounded-full font-semibold text-lg shadow-xl hover:scale-105 transition-transform"
            >
              <Plus size={24} />
              <span>Plan a Trip</span>
            </button>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#235789" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#235789" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all ${
                  currentSlide === index ? 'w-8 bg-[#FDFFFC]' : 'w-3 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
          <div className="grid md:grid-cols-[1fr_auto] gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search destinations, trips, or activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789] transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-50 text-[#235789] rounded-xl border-none font-medium cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="budget-high">Budget: High to Low</option>
                <option value="budget-low">Budget: Low to High</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 bg-gray-50 text-[#235789] rounded-xl border-none font-medium cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="cultural">Cultural</option>
                <option value="adventure">Adventure</option>
                <option value="beach">Beach</option>
              </select>
            </div>
          </div>
        </div>

        {/* Top Regional Selections */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h3 className="text-3xl font-bold text-[#235789] flex items-center gap-2">
              <TrendingUp size={28} />
              <span>Top Regional Selections</span>
            </h3>
             <button onClick={() => navigate('/search/cities')}>
                View All →
              </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {filteredRegions.map((region) => (
              <div 
                key={region.id} 
                className="relative rounded-2xl overflow-hidden h-48 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer"
              >
                <img 
                  src={region.image} 
                  alt={region.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#235789]/90 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block px-3 py-1 bg-[#235789] text-[#FDFFFC] text-xs font-semibold rounded-full mb-2">
                    {region.tag}
                  </span>
                  <h4 className="text-[#FDFFFC] font-bold text-lg">
                    {region.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Previous Trips */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold text-[#235789] flex items-center gap-2">
              <Calendar size={28} />
              <span>Previous Trips</span>
            </h3>
            <button 
              onClick={() => navigate('/my-trips')}
              className="text-[#235789] font-semibold hover:underline"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <div 
                key={trip.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="relative h-48">
                  <img 
                    src={trip.image} 
                    alt={trip.name} 
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white/95 rounded-lg shadow-lg hover:scale-110 transition-transform">
                    <Share2 size={16} className="text-[#235789]" />
                  </button>
                </div>
                <div className="p-5">
                  <h4 className="text-xl font-bold text-[#235789] mb-4">
                    {trip.name}
                  </h4>
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#235789]" />
                      <span>{trip.destinations} destinations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#235789]" />
                      <span>{trip.duration} • {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-[#235789]" />
                      <span>Budget: ${trip.budget.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/trip/${trip.id}/itinerary`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#235789] text-[#FDFFFC] rounded-xl font-medium hover:bg-[#1a4060] transition-colors"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button onClick={() => navigate(`/trip/${trip.id}/build`)} className="p-2 bg-gray-100 text-[#235789] rounded-xl hover:bg-gray-200 transition-colors">
                      <Edit2 size={16} />
                    </button>
                   
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Floating Action Button */}
        <button 
          onClick={() => navigate('/create-trip')}
          className="fixed bottom-8 right-8 w-16 h-16 bg-[#235789] text-[#FDFFFC] rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center z-40"
        >
          <Plus size={28} />
        </button>
      </main>
    </div>
  );
};

export default Home;