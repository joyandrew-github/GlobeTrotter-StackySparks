import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Eye, Edit2, Trash2, Plus, Search, Grid, List, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/trips';

const MyTrips = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Fetch trips from backend
  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your trips');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setTrips(response.data.data || []);
        } else {
          setError('Failed to load trips');
        }
      } catch (err) {
        console.error('Error fetching trips:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/auth');
        } else {
          setError(err.response?.data?.message || 'Failed to load trips. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [navigate]);

  // Helper: Calculate trip duration in days
  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  // Helper: Determine trip status
  const getTripStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) return 'upcoming';
    if (today >= start && today <= end) return 'ongoing';
    return 'completed';
  };

  const getStatusBadge = (status) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-700',
      ongoing: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700'
    };
    return styles[status] || styles.upcoming;
  };

  // Filter and sort trips
  const filteredTrips = trips
    .filter(trip => {
      const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (trip.description && trip.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const status = getTripStatus(trip.startDate, trip.endDate);
      const matchesStatus = filterStatus === 'all' || status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'budget-high') return (b.budget?.grandTotal || 0) - (a.budget?.grandTotal || 0);
      if (sortBy === 'budget-low') return (a.budget?.grandTotal || 0) - (b.budget?.grandTotal || 0);
      return 0;
    });

  const handleDelete = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTrips(trips.filter(trip => trip.id !== tripId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete trip');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFFFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#235789] mb-2">
              My Trips
            </h1>
            <p className="text-gray-600">
              Manage and explore your travel adventures
            </p>
          </div>
          <button
            onClick={() => navigate("/create-trip")}
            className="flex items-center gap-2 px-6 py-3 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold hover:bg-[#1a4060] transition-colors shadow-lg"
          >
            <Plus size={20} />
            New Trip
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search trips by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789] transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789] cursor-pointer font-medium text-[#235789]"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789] cursor-pointer font-medium text-[#235789]"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="budget-high">Budget: High to Low</option>
                <option value="budget-low">Budget: Low to High</option>
              </select>

              <div className="flex gap-2 border-2 border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#235789] text-[#FDFFFC]' : 'text-gray-400 hover:text-[#235789]'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#235789] text-[#FDFFFC]' : 'text-gray-400 hover:text-[#235789]'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#235789] animate-spin" />
            <p className="mt-4 text-gray-600">Loading your trips...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredTrips.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <MapPin size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'No trips match your current filters'
                : 'Start planning your first adventure!'}
            </p>
            <button
              onClick={() => navigate("/create-trip")}
              className="px-6 py-3 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold hover:bg-[#1a4060] transition-colors"
            >
              Create Your First Trip
            </button>
          </div>
        )}

        {/* Trips List/Grid */}
        {!loading && !error && filteredTrips.length > 0 && (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredTrips.map((trip) => {
              const status = getTripStatus(trip.startDate, trip.endDate);
              const destinationsCount = trip.stops?.length || 0;
              const totalBudget = trip.budget?.grandTotal || 0;

              return viewMode === 'grid' ? (
                <div key={trip.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={trip.coverImage || 'https://via.placeholder.com/400x300?text=No+Cover+Image'}
                      alt={trip.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(status)}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-[#235789] mb-3">{trip.title}</h3>

                    {trip.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
                    )}

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#235789]" />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                          {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#235789]" />
                        <span>{destinationsCount} destination{destinationsCount !== 1 ? 's' : ''} • {calculateDuration(trip.startDate, trip.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-[#235789]" />
                        <span>${totalBudget.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/trip/${trip.id}/build`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#235789] text-[#FDFFFC] rounded-lg hover:bg-[#1a4060] transition-colors font-medium"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/trip/${trip.id}/edit`)}
                        className="px-3 py-2 bg-gray-100 text-[#235789] rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(trip.id)}
                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // List View (same logic, just different layout)
                <div key={trip.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-64 h-48 sm:h-auto">
                      <img
                        src={trip.coverImage || 'https://via.placeholder.com/400x300?text=No+Cover+Image'}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(status)}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-[#235789]">{trip.title}</h3>
                      </div>

                      {trip.description && <p className="text-gray-600 text-sm mb-4">{trip.description}</p>}

                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-[#235789]" />
                          <span>
                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-[#235789]" />
                          <span>{destinationsCount} destination{destinationsCount !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-[#235789]" />
                          <span>${totalBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-[#235789]" />
                          <span>{calculateDuration(trip.startDate, trip.endDate)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/trip/${trip.id}/build`)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#235789] text-[#FDFFFC] rounded-lg hover:bg-[#1a4060] transition-colors font-medium"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                        <button
                          onClick={() => navigate(`/trip/${trip.id}/edit`)}
                          className="px-4 py-2 bg-gray-100 text-[#235789] rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          <Edit2 size={16} className="inline mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(trip.id)}
                          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;