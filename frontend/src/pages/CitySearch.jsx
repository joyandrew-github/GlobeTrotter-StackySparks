import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, TrendingUp, Plus, Filter, X, Star, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CitySearch = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCostRange, setSelectedCostRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCities();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Fetch cities on search
  const fetchCities = async () => {
    if (searchQuery.trim().length > 0 && searchQuery.trim().length < 2) return;

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('q', searchQuery.trim());

      const response = await fetch(`http://localhost:5000/api/cities/search?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch cities');
      }

      setCities(result.data || []);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  // Load popular cities on mount
  useEffect(() => {
    const loadPopular = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/cities/popular?limit=20', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          credentials: 'include'
        });

        const result = await response.json();
        if (response.ok) {
          setCities(result.data || []);
        }
      } catch (err) {
        setError('Failed to load popular cities');
      } finally {
        setLoading(false);
      }
    };

    loadPopular();
  }, []);

  // Client-side filtering
  useEffect(() => {
    const filtered = cities.filter(city => {
      const matchesCost = selectedCostRange === 'all' ||
        (selectedCostRange === 'budget' && city.costIndex <= 2) ||
        (selectedCostRange === 'moderate' && city.costIndex === 3) ||
        (selectedCostRange === 'expensive' && city.costIndex >= 4);
      // Region filtering disabled for now since not in schema yet
      // You can add city.region when you update the schema
      return matchesCost;
    });
    setFilteredCities(filtered);
  }, [cities, selectedCostRange]);

  const getCostLabel = (index) => {
    const labels = ['', 'Budget', 'Affordable', 'Moderate', 'Expensive', 'Luxury'];
    return labels[index] || 'Moderate';
  };

  const getCostColor = (index) => {
    if (index <= 2) return 'text-green-600';
    if (index === 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setSelectedCostRange('all');
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFFFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-[#235789] hover:underline flex items-center gap-2 mb-4"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#235789] mb-2">Discover Cities</h1>
          <p className="text-gray-600">Find the perfect destinations for your next adventure</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
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

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-[#235789] rounded-xl font-medium border-2 border-gray-200"
            >
              <Filter size={20} />
              Filters
            </button>

            {/* Removed region filter temporarily since not in schema */}
            <div className="hidden lg:flex gap-3">
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

          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
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

        {/* Loading / Error */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 size={48} className="mx-auto animate-spin text-[#235789]" />
            <p className="mt-4 text-gray-600">Loading cities...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-[#235789]">{filteredCities.length}</span> cities
              </p>
            </div>

            {filteredCities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCities.map((city) => (
                  <div
                    key={city.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => setSelectedCity(city)}
                  >
                    <div className="relative h-48">
                      <img
                        src={city.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={city.name}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'}
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          {city.popularity}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-3">
                        <h3 className="text-xl font-bold text-[#235789] mb-1">{city.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <MapPin size={14} />
                          {city.country}
                        </p>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {city.description || 'Explore this amazing destination.'}
                      </p>

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
                            ${city.avgDailyCost || 100}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Best Time</p>
                          <p className="text-xs font-semibold text-gray-700">
                            {city.bestTime || 'Year-round'}
                          </p>
                        </div>
                      </div>

                      {/* Highlights Tags */}
                      {city.highlights && city.highlights.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">Top Highlights</p>
                          <div className="flex flex-wrap gap-2">
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
                      )}

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
                <button onClick={clearFilters} className="px-6 py-3 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold hover:bg-[#1a4060] transition-colors">
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}

        {/* City Detail Modal */}
        {selectedCity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCity(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative h-64">
                <img
                  src={selectedCity.image || 'https://via.placeholder.com/800x400?text=No+Image'}
                  alt={selectedCity.name}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/800x400?text=No+Image'}
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
                  {selectedCity.country}
                </p>

                <p className="text-gray-700 mb-6">{selectedCity.description || 'A must-visit destination with rich culture and beauty.'}</p>

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
                    <p className="text-2xl font-bold text-[#235789]">${selectedCity.avgDailyCost || 100}</p>
                  </div>
                </div>

                {selectedCity.highlights && selectedCity.highlights.length > 0 && (
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
                )}

                {selectedCity.bestTime && (
                  <div className="mb-6">
                    <h3 className="font-bold text-[#235789] mb-2">Best Time to Visit</h3>
                    <p className="text-gray-700">{selectedCity.bestTime}</p>
                  </div>
                )}

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