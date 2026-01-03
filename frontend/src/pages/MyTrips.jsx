import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Eye, Edit2, Trash2, Plus, Search, Filter, Grid, List } from 'lucide-react';
import { nav } from 'framer-motion/client';

const MyTrips = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const navigate = useNavigate();
  // Sample trips data
  const [trips, setTrips] = useState([
    {
      id: 1,
      name: 'European Adventure',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400',
      startDate: '2024-06-15',
      endDate: '2024-06-29',
      destinations: 5,
      budget: 3500,
      status: 'upcoming',
      description: 'Exploring the best of Western Europe'
    },
    {
      id: 2,
      name: 'Asian Expedition',
      image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400',
      startDate: '2024-08-20',
      endDate: '2024-08-30',
      destinations: 3,
      budget: 2200,
      status: 'upcoming',
      description: 'Cultural journey through Asia'
    },
    {
      id: 3,
      name: 'Beach Paradise',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
      startDate: '2023-12-10',
      endDate: '2023-12-17',
      destinations: 2,
      budget: 1800,
      status: 'completed',
      description: 'Relaxing tropical getaway'
    },
    {
      id: 4,
      name: 'Mountain Retreat',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      startDate: '2024-03-05',
      endDate: '2024-03-12',
      destinations: 4,
      budget: 2800,
      status: 'completed',
      description: 'Hiking and adventure in the mountains'
    }
  ]);

  const calculateDuration = (start, end) => {
    const days = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  const getStatusBadge = (status) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-700',
      ongoing: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700'
    };
    return styles[status] || styles.upcoming;
  };

  const filteredTrips = trips
    .filter(trip => {
      const matchesSearch = trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trip.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || trip.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.startDate) - new Date(a.startDate);
      if (sortBy === 'oldest') return new Date(a.startDate) - new Date(b.startDate);
      if (sortBy === 'budget-high') return b.budget - a.budget;
      if (sortBy === 'budget-low') return a.budget - b.budget;
      return 0;
    });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      setTrips(trips.filter(trip => trip.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFFFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#235789] mb-2">
              My Trips
            </h1>
            <p className="text-gray-600">
              Manage and view all your travel adventures
            </p>
          </div>
          <button  onClick={()=>navigate("/create-trip")} className="flex items-center gap-2 px-6 py-3 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold hover:bg-[#1a4060] transition-colors shadow-lg">
            <Plus size={20} />
            New Trip
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search trips..."
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
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-[#235789] text-[#FDFFFC]' : 'text-gray-400 hover:text-[#235789]'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-[#235789] text-[#FDFFFC]' : 'text-gray-400 hover:text-[#235789]'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <MapPin size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No trips found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start planning your first adventure!'}
            </p>
            <button className="px-6 py-3 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold hover:bg-[#1a4060] transition-colors">
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredTrips.map((trip) => (
              viewMode === 'grid' ? (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={trip.image}
                      alt={trip.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(trip.status)}`}>
                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-[#235789] mb-3">
                      {trip.name}
                    </h3>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#235789]" />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#235789]" />
                        <span>{trip.destinations} destinations • {calculateDuration(trip.startDate, trip.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-[#235789]" />
                        <span>${trip.budget.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={()  => navigate(`/trip/${trip.id}/build`)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#235789] text-[#FDFFFC] rounded-lg hover:bg-[#1a4060] transition-colors font-medium">
                        <Eye size={16} />
                        View
                      </button>
                      <button className="px-3 py-2 bg-gray-100 text-[#235789] rounded-lg hover:bg-gray-200 transition-colors">
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
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-64 h-48 sm:h-auto">
                      <img
                        src={trip.image}
                        alt={trip.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(trip.status)}`}>
                          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-[#235789]">
                          {trip.name}
                        </h3>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{trip.description}</p>

                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-[#235789]" />
                          <span>
                            {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-[#235789]" />
                          <span>{trip.destinations} destinations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-[#235789]" />
                          <span>${trip.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-[#235789]" />
                          <span>{calculateDuration(trip.startDate, trip.endDate)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/trip/${trip.id}/build`)} className="flex items-center gap-2 px-4 py-2 bg-[#235789] text-[#FDFFFC] rounded-lg hover:bg-[#1a4060] transition-colors font-medium">
                          <Eye size={16} />
                          View Details
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-[#235789] rounded-lg hover:bg-gray-200 transition-colors font-medium">
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
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;