import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, MapPin, Grid, List, Download, Share2, Edit2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const ItineraryView = () => {
  const navigate = useNavigate();
  const { id: tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('day');

  // Helper for authenticated requests
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Session expired. Please log in again.');
          }
          throw new Error('Failed to load itinerary');
        }

        const { success, data } = await response.json();

        if (!success || !data) {
          throw new Error('Invalid trip data');
        }

        // Transform backend data to UI-friendly structure
        const transformed = {
          tripName: data.title,
          totalDays: calculateTotalDays(data.startDate, data.endDate),
          totalCost: Math.round(data.budget?.grandTotal || 0),
          destinations: (data.stops || []).map((stop) => ({
            id: stop.id,
            city: stop.city?.name || 'Unknown City',
            country: stop.city?.country || '',
            startDate: stop.startDate ? new Date(stop.startDate).toISOString().split('T')[0] : '',
            endDate: stop.endDate ? new Date(stop.endDate).toISOString().split('T')[0] : '',
            days: groupActivitiesByDay(stop.activities || [], stop.startDate),
          })),
        };

        setTrip(transformed);
      } catch (err) {
        console.error('Error fetching trip:', err);
        setError(err.message || 'Could not load your itinerary.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  // Calculate total trip days (inclusive)
  const calculateTotalDays = (start, end) => {
    if (!start || !end) return 0;
    const diffMs = new Date(end) - new Date(start);
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
  };

  // Group activities by day relative to stop startDate
  const groupActivitiesByDay = (activities, stopStartDate) => {
    if (!stopStartDate) return [];

    const start = new Date(stopStartDate);
    const dayMap = new Map();

    activities.forEach((act) => {
      // Backend should have 'day' field (1-based)
      const dayNum = act.day || 1;
      const date = new Date(start);
      date.setDate(start.getDate() + dayNum - 1);

      if (!dayMap.has(dayNum)) {
        dayMap.set(dayNum, {
          date: date.toISOString().split('T')[0],
          dayNumber: dayNum,
          activities: [],
        });
      }

      dayMap.get(dayNum).activities.push({
        id: act.id,
        time: act.time || '—',
        name: act.name || 'Unnamed activity',
        duration: act.durationHr ? `${act.durationHr} hr${act.durationHr > 1 ? 's' : ''}` : '—',
        cost: Number(act.cost) || 0,
        category: act.type?.toLowerCase() || 'activities', // map type → category
      });
    });

    return Array.from(dayMap.values()).sort((a, b) => a.dayNumber - b.dayNumber);
  };

  const getCategoryColor = (category) => {
    const colors = {
      transport: 'bg-blue-100 text-blue-700',
      meals: 'bg-orange-100 text-orange-700',
      activities: 'bg-green-100 text-green-700',
      stay: 'bg-purple-100 text-purple-700',
      shopping: 'bg-pink-100 text-pink-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const calculateDayCost = (activities) => {
    return activities.reduce((sum, act) => sum + (act.cost || 0), 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFFFC] flex items-center justify-center">
        <div className="text-xl text-[#235789]">Loading your itinerary...</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-[#FDFFFC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error || 'Failed to load itinerary'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#235789] text-white rounded-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFFFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* ← Back button, header, view toggle, destinations rendering */}
        {/* The rest of your JSX remains almost identical — just use `trip` instead of `itineraryData` */}

        <button
          onClick={() => navigate(-1)}
          className="text-[#235789] hover:underline flex items-center gap-2 mb-4"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-[#235789] mb-2">{trip.tripName}</h1>
              <p className="text-gray-600">
                {trip.totalDays} days • ${trip.totalCost.toLocaleString()} total budget
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/trip/${tripId}/build`)}
                className="p-3 bg-white border-2 border-[#235789] text-[#235789] rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => navigate(`/trip/${tripId}/budget`)}
                className="p-3 bg-white border-2 border-[#235789] text-[#235789] rounded-xl hover:bg-gray-50 transition-colors"
              >
                <DollarSign size={20} />
              </button>
              <button className="p-3 bg-white border-2 border-[#235789] text-[#235789] rounded-xl hover:bg-gray-50 transition-colors">
                <Download size={20} />
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-white p-1 rounded-xl shadow-md w-fit">
            <button
              onClick={() => setViewMode('day')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'day' ? 'bg-[#235789] text-[#FDFFFC]' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar size={18} />
              Day View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list' ? 'bg-[#235789] text-[#FDFFFC]' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List size={18} />
              List View
            </button>
          </div>
        </div>

        {/* Itinerary Content */}
        <div className="space-y-8">
          {trip.destinations.map((destination) => (
            <div key={destination.id} className="space-y-6">
              {/* Destination Header */}
              <div className="bg-gradient-to-r from-[#235789] to-[#1a4060] rounded-2xl p-6 text-[#FDFFFC] shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin size={28} />
                  <div>
                    <h2 className="text-3xl font-bold">{destination.city}</h2>
                    <p className="text-sm opacity-90">{destination.country}</p>
                  </div>
                </div>
                <div className="flex gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>
                      {new Date(destination.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                      {new Date(destination.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{destination.days.length} days</span>
                  </div>
                </div>
              </div>

              {/* Days - same as your original code, using destination.days */}
              {viewMode === 'day' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {destination.days.map((day) => (
                    <div key={day.dayNumber} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b-2 border-[#235789]">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xl font-bold text-[#235789]">Day {day.dayNumber}</span>
                          <span className="text-sm font-semibold text-gray-600">
                            ${calculateDayCost(day.activities)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{formatDate(day.date)}</p>
                      </div>
                      <div className="p-4 space-y-3">
                        {day.activities.map((activity) => (
                          <div key={activity.id} className="pb-3 border-b border-gray-100 last:border-0">
                            <div className="flex items-start gap-3">
                              <div className="text-xs font-semibold text-[#235789] mt-1 whitespace-nowrap">
                                {activity.time}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                                  {activity.name}
                                </h4>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(activity.category)}`}>
                                    {activity.category}
                                  </span>
                                  <span className="text-xs text-gray-500">{activity.duration}</span>
                                  {activity.cost > 0 && (
                                    <span className="text-xs font-semibold text-gray-700">${activity.cost}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // List view - keep your original list view code here
                // ... (copy your list view JSX from original)
                <div className="space-y-4">
                  {/* Your list view implementation */}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary Footer */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-[#235789] mb-4">Trip Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Total Days</p>
              <p className="text-2xl font-bold text-[#235789]">{trip.totalDays}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Destinations</p>
              <p className="text-2xl font-bold text-[#235789]">{trip.destinations.length}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Total Cost</p>
              <p className="text-2xl font-bold text-[#235789]">${trip.totalCost.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Avg/Day</p>
              <p className="text-2xl font-bold text-[#235789]">
                ${trip.totalDays > 0 ? Math.round(trip.totalCost / trip.totalDays) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;