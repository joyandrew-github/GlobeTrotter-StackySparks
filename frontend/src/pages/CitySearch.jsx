import React, { useState } from 'react';
import { Search, MapPin, DollarSign, TrendingUp, Plus, Filter, X, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const CitySearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCostRange, setSelectedCostRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const cities = [
    {
      id: 1,
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
      costIndex: 4,
      popularity: 95,
      description: 'The City of Light, known for its art, fashion, and iconic landmarks',
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame'],
      bestTime: 'Apr-Jun, Sep-Oct',
      avgDailyCost: 150
    },
    {
      id: 2,
      name: 'Tokyo',
      country: 'Japan',
      region: 'Asia',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
      costIndex: 4,
      popularity: 92,
      description: 'A vibrant metropolis blending traditional culture with modern innovation',
      highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Tower'],
      bestTime: 'Mar-May, Sep-Nov',
      avgDailyCost: 140
    },
    {
      id: 3,
      name: 'Bali',
      country: 'Indonesia',
      region: 'Asia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
      costIndex: 2,
      popularity: 88,
      description: 'Tropical paradise with stunning beaches, temples, and rice terraces',
      highlights: ['Ubud Rice Terraces', 'Tanah Lot', 'Beach Clubs'],
      bestTime: 'Apr-Oct',
      avgDailyCost: 60
    },
    {
      id: 4,
      name: 'New York',
      country: 'USA',
      region: 'Americas',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
      costIndex: 5,
      popularity: 94,
      description: 'The city that never sleeps, offering world-class entertainment and culture',
      highlights: ['Statue of Liberty', 'Central Park', 'Times Square'],
      bestTime: 'Apr-Jun, Sep-Nov',
      avgDailyCost: 180
    },
    {
      id: 5,
      name: 'Barcelona',
      country: 'Spain',
      region: 'Europe',
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400',
      costIndex: 3,
      popularity: 90,
      description: 'Mediterranean beauty with stunning architecture and vibrant culture',
      highlights: ['Sagrada Familia', 'Park Güell', 'La Rambla'],
      bestTime: 'May-Jun, Sep-Oct',
      avgDailyCost: 110
    },
    {
      id: 6,
      name: 'Dubai',
      country: 'UAE',
      region: 'Middle East',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
      costIndex: 4,
      popularity: 87,
      description: 'Luxury destination with modern architecture and desert adventures',
      highlights: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah'],
      bestTime: 'Nov-Mar',
      avgDailyCost: 160
    },
    {
      id: 7,
      name: 'Bangkok',
      country: 'Thailand',
      region: 'Asia',
      image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400',
      costIndex: 1,
      popularity: 91,
      description: 'Vibrant city with ornate temples, street food, and bustling markets',
      highlights: ['Grand Palace', 'Wat Pho', 'Floating Markets'],
      bestTime: 'Nov-Feb',
      avgDailyCost: 50
    },
    {
      id: 8,
      name: 'Rome',
      country: 'Italy',
      region: 'Europe',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
      costIndex: 3,
      popularity: 93,
      description: 'Ancient city filled with historical monuments and world-class cuisine',
      highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain'],
      bestTime: 'Apr-Jun, Sep-Oct',
      avgDailyCost: 120
    }
  ];

  const getCostLabel = (index) => {
    const labels = ['', 'Budget', 'Affordable', 'Moderate', 'Expensive', 'Luxury'];
    return labels[index] || 'Moderate';
  };

  const getCostColor = (index) => {
    if (index <= 2) return 'text-green-600';
    if (index === 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         city.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || city.region === selectedRegion;
    const matchesCost = selectedCostRange === 'all' || 
                       (selectedCostRange === 'budget' && city.costIndex <= 2) ||
                       (selectedCostRange === 'moderate' && city.costIndex === 3) ||
                       (selectedCostRange === 'expensive' && city.costIndex >= 4);
    return matchesSearch && matchesRegion && matchesCost;
  });

  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <div className="min-h-screen bg-[#FDFFFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
  <button 
    onClick={() => navigate(-1)}
    className="text-[#235789] hover:underline flex items-center gap-2 mb-4"
  >
    ← Back
  </button>
</div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#235789] mb-2">Discover Cities</h1>
          <p className="text-gray-600">Find the perfect destinations for your next adventure</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search cities or countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789] transition-colors"
              />
            </div>

            {/* Filter Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-[#235789] rounded-xl font-medium border-2 border-gray-200"
            >
              <Filter size={20} />
              Filters
            </button>

            {/* Filters (Desktop) */}
            <div className="hidden lg:flex gap-3">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789] cursor-pointer font-medium text-[#235789]"
              >
                <option value="all">All Regions</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Americas">Americas</option>
                <option value="Middle East">Middle East</option>
                <option value="Africa">Africa</option>
                <option value="Oceania">Oceania</option>
              </select>

              <select
                value={selectedCostRange}
                onChange={(e) => setSelectedCostRange(e.target.value)}
                className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789] cursor-pointer font-medium text-[#235789]"
              >
                <option value="all">All Budgets</option>
                <option value="budget">Budget ($ - $$)</option>
                <option value="moderate">Moderate ($$$)</option>
                <option value="expensive">Expensive ($$$$+)</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789] cursor-pointer font-medium text-[#235789]"
              >
                <option value="all">All Regions</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Americas">Americas</option>
                <option value="Middle East">Middle East</option>
              </select>

              <select
                value={selectedCostRange}
                onChange={(e) => setSelectedCostRange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789] cursor-pointer font-medium text-[#235789]"
              >
                <option value="all">All Budgets</option>
                <option value="budget">Budget ($ - $$)</option>
                <option value="moderate">Moderate ($$$)</option>
                <option value="expensive">Expensive ($$$$+)</option>
              </select>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-[#235789]">{filteredCities.length}</span> cities
          </p>
        </div>

        {/* Cities Grid */}
        {filteredCities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <div
                key={city.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedCity(city)}
              >
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      {city.popularity}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-[#235789] mb-1">{city.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <MapPin size={14} />
                      {city.country} • {city.region}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {city.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Cost Level</p>
                      <p className={`text-sm font-bold ${getCostColor(city.costIndex)}`}>
                        {getCostLabel(city.costIndex)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Avg Daily</p>
                      <p className="text-sm font-bold text-[#235789]">
                        ${city.avgDailyCost}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Best Time</p>
                      <p className="text-xs font-semibold text-gray-700">
                        {city.bestTime}
                      </p>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Top Highlights</p>
                    <div className="flex flex-wrap gap-1">
                      {city.highlights.slice(0, 3).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-[#235789] text-xs rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Add Button */}
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold hover:bg-[#1a4060] transition-colors">
                    <Plus size={18} />
                    Add to Trip
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <MapPin size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No cities found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('all');
                setSelectedCostRange('all');
              }}
              className="px-6 py-3 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold hover:bg-[#1a4060] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* City Detail Modal */}
        {selectedCity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative h-64">
                <img
                  src={selectedCity.image}
                  alt={selectedCity.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedCity(null)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={24} className="text-gray-700" />
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-3xl font-bold text-[#235789] mb-2">{selectedCity.name}</h2>
                <p className="text-gray-600 mb-4 flex items-center gap-2">
                  <MapPin size={16} />
                  {selectedCity.country} • {selectedCity.region}
                </p>

                <p className="text-gray-700 mb-6">{selectedCity.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Popularity</p>
                    <p className="text-2xl font-bold text-[#235789]">{selectedCity.popularity}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Cost Level</p>
                    <p className={`text-lg font-bold ${getCostColor(selectedCity.costIndex)}`}>
                      {getCostLabel(selectedCity.costIndex)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Daily Budget</p>
                    <p className="text-2xl font-bold text-[#235789]">${selectedCity.avgDailyCost}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-[#235789] mb-3">Top Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCity.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-2 bg-blue-50 text-[#235789] text-sm rounded-lg font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-[#235789] mb-2">Best Time to Visit</h3>
                  <p className="text-gray-700">{selectedCity.bestTime}</p>
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold text-lg hover:bg-[#1a4060] transition-colors">
                  <Plus size={20} />
                  Add to My Trip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitySearch;