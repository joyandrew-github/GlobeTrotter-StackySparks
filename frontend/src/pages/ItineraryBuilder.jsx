import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Plus, X, GripVertical, Edit2, Trash2, DollarSign, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const ItineraryBuilder = () => {
  const navigate = useNavigate();
  const { id: tripId } = useParams();
  const [tripStops, setTripStops] = useState([]);
  const [showAddStop, setShowAddStop] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper for authenticated requests
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

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
        throw new Error('Failed to fetch trip');
      }

      const { success, data } = await response.json();

      if (!success || !data?.stops) {
        throw new Error('Invalid trip data');
      }

      const formattedStops = data.stops.map(stop => ({
        id: stop.id,
        cityId: stop.city?.id,
        city: stop.city?.name || 'Unknown City',
        country: stop.city?.country || '',
        startDate: stop.startDate ? stop.startDate.split('T')[0] : '',
        endDate: stop.endDate ? stop.endDate.split('T')[0] : '',
        activities: (stop.activities || []).map(act => ({
          id: act.id,
          name: act.name || 'Unnamed activity',
          time: act.time || '', // can be added later
          duration: act.durationHr ? `${act.durationHr} hr${act.durationHr > 1 ? 's' : ''}` : '—',
          cost: Number(act.cost) || 0
        }))
      }));

      setTripStops(formattedStops);
    } catch (err) {
      console.error('Error fetching trip:', err);
      setError(err.message || 'Could not load your itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addNewStop = () => setShowAddStop(true);

  const handleAddStop = async (newStopData) => {
    try {
      const currentStopsPayload = tripStops.map(stop => ({
        cityId: stop.cityId,
        startDate: stop.startDate,
        endDate: stop.endDate
      }));

      const updatedStops = [...currentStopsPayload, newStopData];

      const response = await fetch(`http://localhost:5000/api/trips/${tripId}/stops`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedStops)
      });

      if (!response.ok) throw new Error('Failed to add stop');

      await fetchTrip();
      setShowAddStop(false);
    } catch (error) {
      console.error('Error adding stop:', error);
      alert('Failed to add destination. Please try again.');
    }
  };

  const removeStop = async (stopId) => {
    if (!window.confirm('Remove this stop from your itinerary? Activities will be lost.')) return;

    try {
      const updatedStops = tripStops
        .filter(stop => stop.id !== stopId)
        .map(stop => ({
          cityId: stop.cityId,
          startDate: stop.startDate,
          endDate: stop.endDate
        }));

      const response = await fetch(`http://localhost:5000/api/trips/${tripId}/stops`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedStops)
      });

      if (!response.ok) throw new Error('Failed to remove stop');

      await fetchTrip();
    } catch (error) {
      console.error('Error removing stop:', error);
      alert('Failed to remove destination.');
    }
  };

  const addActivity = async (stopId, activity) => {
    try {
      const stop = tripStops.find(s => s.id === stopId);
      if (!stop) return;

      const currentActivities = stop.activities || [];

      const newActivityPayload = {
        name: activity.name.trim(),
        type: 'SIGHTSEEING', // can be made selectable later
        cost: Number(activity.cost) || 0,
        durationHr: parseInt(activity.duration) || 1,
        day: 1, // placeholder - can be improved later
        order: currentActivities.length + 1
      };

      const updatedActivities = [
        ...currentActivities.map(a => ({
          name: a.name,
          type: 'SIGHTSEEING',
          cost: Number(a.cost),
          durationHr: parseInt(a.duration) || 1,
          day: 1
        })),
        newActivityPayload
      ];

      const response = await fetch(`http://localhost:5000/api/activities/${stopId}/activities`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedActivities)
      });

      if (!response.ok) throw new Error('Failed to add activity');

      await fetchTrip();
      setShowAddActivity(null);
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Failed to add activity.');
    }
  };

  const removeActivity = async (stopId, activityId) => {
    try {
      const stop = tripStops.find(s => s.id === stopId);
      if (!stop) return;

      const updatedActivities = stop.activities
        .filter(a => a.id !== activityId)
        .map(a => ({
          name: a.name,
          type: 'SIGHTSEEING',
          cost: Number(a.cost),
          durationHr: parseInt(a.duration) || 1,
          day: 1
        }));

      const response = await fetch(`http://localhost:5000/api/activities/${stopId}/activities`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedActivities)
      });

      if (!response.ok) throw new Error('Failed to remove activity');

      await fetchTrip();
    } catch (error) {
      console.error('Error removing activity:', error);
      alert('Failed to remove activity.');
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newStops = [...tripStops];
    const draggedStop = newStops[draggedItem];
    newStops.splice(draggedItem, 1);
    newStops.splice(index, 0, draggedStop);

    setTripStops(newStops);
    setDraggedItem(index);
  };

  const handleDragEnd = async () => {
    setDraggedItem(null);
    try {
      const orderedStopIds = tripStops.map(stop => stop.id);

      const response = await fetch(`http://localhost:5000/api/trips/${tripId}/stops/order`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ orderedStopIds })
      });

      if (!response.ok) throw new Error('Failed to save order');
    } catch (error) {
      console.error('Failed to update stop order:', error);
      alert('Failed to save new order. Please try again.');
      await fetchTrip(); // revert to server state
    }
  };

  const calculateStopCost = (activities = []) => {
    return activities.reduce((sum, act) => sum + (Number(act.cost) || 0), 0);
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return '—';
    const days = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFFFC]">
        <div className="text-xl text-[#235789]">Loading your itinerary...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFFFC]">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button
            onClick={() => { setError(null); fetchTrip(); }}
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
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-[#235789] hover:underline flex items-center gap-2 mb-6"
        >
          ← Back to Trips
        </button>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#235789] mb-3">Build Your Itinerary</h1>
          <p className="text-gray-600 text-lg">Plan your perfect trip — destination by destination</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-10">
          <button
            onClick={addNewStop}
            className="flex items-center gap-2 px-6 py-3 bg-[#235789] text-white rounded-xl font-medium hover:bg-[#1a4060] transition-colors shadow-md"
          >
            <Plus size={20} />
            Add Destination
          </button>

          <button
            onClick={() => navigate(`/trip/${tripId}/itinerary`)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-[#235789] border-2 border-[#235789] rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            <Save size={20} />
            View Full Itinerary
          </button>

          <button
            onClick={() => navigate(`/trip/${tripId}/budget`)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-[#235789] border-2 border-[#235789] rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            <DollarSign size={20} />
            Budget Overview
          </button>
        </div>

        <div className="space-y-6">
          {tripStops.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <MapPin size={64} className="mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">Your journey starts here</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Add your first destination to begin planning the adventure
              </p>
              <button
                onClick={addNewStop}
                className="px-8 py-4 bg-[#235789] text-white rounded-xl font-medium hover:bg-[#1a4060] transition-colors shadow-md"
              >
                + Add First Destination
              </button>
            </div>
          ) : (
            tripStops.map((stop, index) => (
              <div
                key={stop.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 ${
                  draggedItem === index ? 'opacity-60 scale-[0.98]' : 'opacity-100'
                }`}
              >
                {/* Stop Header */}
                <div className="bg-gradient-to-r from-[#235789] to-[#1a4060] p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <button className="cursor-move mt-1.5 hover:scale-110 transition-transform">
                        <GripVertical size={24} />
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                            Stop {index + 1}
                          </span>
                          <span className="text-sm opacity-90">
                            {calculateDuration(stop.startDate, stop.endDate)}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stop.city}</h3>
                        <p className="text-sm opacity-90 mb-4">{stop.country}</p>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>
                              {new Date(stop.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              {' - '}
                              {new Date(stop.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Rs:{calculateStopCost(stop.activities)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => removeStop(stop.id)}
                        className="p-2 hover:bg-red-500/30 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Activities Section */}
                <div className="p-6">
                  {stop.activities?.length > 0 ? (
                    <div className="space-y-3 mb-6">
                      {stop.activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#235789] mb-2">{activity.name}</h4>
                            <div className="flex flex-wrap gap-5 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Clock size={14} />
                                <span>{activity.time || '—'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={14} />
                                <span>{activity.duration}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>Rs:{activity.cost}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeActivity(stop.id, activity.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-400">
                      <MapPin size={48} className="mx-auto mb-4 opacity-40" />
                      <p>No activities planned yet</p>
                    </div>
                  )}

                  <button
                    onClick={() => setShowAddActivity(stop.id)}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-[#235789] font-medium hover:border-[#235789] hover:bg-gray-50 transition-colors"
                  >
                    + Add Activity
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modals */}
        {showAddStop && (
          <AddStopModal
            onClose={() => setShowAddStop(false)}
            onAdd={handleAddStop}
          />
        )}

        {showAddActivity && (
          <AddActivityModal
            stopId={showAddActivity}
            onClose={() => setShowAddActivity(null)}
            onAdd={(activity) => addActivity(showAddActivity, activity)}
          />
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Add Stop Modal
// ─────────────────────────────────────────────────────────────
const AddStopModal = ({ onClose, onAdd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopular, setShowPopular] = useState(true);

  // Debounced search + popular when empty
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length < 2) {
        setShowPopular(true);
        setCities([]);
        // Optional: load popular or saved cities here
        try {
          setLoading(true);
          const res = await fetch('http:localhost:5000/api/cities/popular?limit=12');
          const data = await res.json();
          if (data.success) {
            setCities(data.data);
          }
        } catch (err) {
          console.error('Popular cities failed:', err);
        } finally {
          setLoading(false);
        }
        return;
      }

      setShowPopular(false);
      setLoading(true);

      try {
        const res = await fetch(`http://localhost:5000/api/cities/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
        const data = await res.json();
        if (data.success) {
          setCities(data.data);
        }
      } catch (err) {
        console.error('City search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 350); // slightly faster feel

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSubmit = () => {
    if (!selectedCity) {
      alert('Please select a destination');
      return;
    }
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      alert('End date must be after start date');
      return;
    }

    onAdd({
      cityId: selectedCity.id,
      startDate,
      endDate
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-4">
          <h3 className="text-2xl font-bold text-[#235789]">Add New Destination</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-[#235789] mb-2">
              Where are you going?
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedCity(null); // reset when typing
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789] focus:ring-1 focus:ring-[#235789] text-lg"
              placeholder="Search city or country (Paris, Tokyo, Italy...)"
              autoFocus
            />
          </div>

          {/* Results / Popular */}
          <div className="relative">
            {loading ? (
              <div className="py-8 text-center text-gray-500">Searching...</div>
            ) : cities.length === 0 && searchQuery.length >= 2 ? (
              <div className="py-8 text-center text-gray-500">
                No destinations found. Try different spelling.
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white shadow-sm">
                {cities.map((city) => (
                  <div
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city);
                      setSearchQuery(`${city.name}, ${city.country}`);
                      setCities([]); // hide list after selection
                    }}
                    className={`cursor-pointer p-4 hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                      selectedCity?.id === city.id ? 'bg-blue-100' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div className="font-medium text-lg">{city.name}</div>
                      <div className="text-sm text-gray-500">{city.country}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedCity && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#235789]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-[#235789]">{selectedCity.name}</div>
                    <div className="text-sm text-gray-600">{selectedCity.country}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedCity(null);
                    setSearchQuery('');
                  }}
                  className="text-sm text-[#235789] hover:underline"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#235789] mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#235789] mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                min={startDate || new Date().toISOString().split('T')[0]}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789]"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8 sticky bottom-0 bg-white pt-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={!selectedCity || !startDate || !endDate}
            className="flex-1 py-3.5 bg-[#235789] text-white rounded-xl font-medium hover:bg-[#1a4060] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Destination
          </button>
          <button
            onClick={onClose}
            className="px-8 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const AddActivityModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    time: '',           // HH:mm format
    duration: '',       // e.g. "2.5", "3", "1.5"
    cost: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Activity name is required';
    if (formData.time && !/^\d{2}:\d{2}Rs:/.test(formData.time)) {
      newErrors.time = 'Invalid time format (use HH:mm)';
    }
    if (formData.duration && isNaN(parseFloat(formData.duration))) {
      newErrors.duration = 'Please enter a valid number (hours)';
    }
    if (formData.cost && (isNaN(parseFloat(formData.cost)) || parseFloat(formData.cost) < 0)) {
      newErrors.cost = 'Please enter a valid non-negative number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onAdd({
      name: formData.name.trim(),
      time: formData.time || null,
      duration: formData.duration ? parseFloat(formData.duration) : null,
      cost: formData.cost ? parseFloat(formData.cost) : 0,
    });

    // Reset form
    setFormData({ name: '', time: '', duration: '', cost: '' });
    setErrors({});
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2">
          <h3 className="text-2xl font-bold text-[#235789]">Add Activity</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Activity Name */}
          <div>
            <label className="block text-sm font-semibold text-[#235789] mb-2">
              What are you doing?
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Eiffel Tower visit, Seine River cruise, Local food tour..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#235789] focus:ring-1 focus:ring-[#235789] transition-all Rs:{
                errors.name ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Time & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#235789] mb-2">
                Time (optional)
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#235789] Rs:{
                  errors.time ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#235789] mb-2">
                Duration (hours)
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="2.5, 3, 1.5, full day..."
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#235789] Rs:{
                  errors.duration ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
            </div>
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-semibold text-[#235789] mb-2">
              Estimated Cost (Rs)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">  
                Rs:
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="0 – 500"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#235789] ${
                  errors.cost ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.cost && <p className="mt-1 text-sm text-red-600">{errors.cost}</p>}
          </div>
        </div>

        <div className="flex gap-4 mt-10 sticky bottom-0 bg-white pt-6 border-t">
          <button
            onClick={handleSubmit}
            disabled={!formData.name.trim()}
            className="flex-1 py-3.5 bg-[#235789] text-white rounded-xl font-medium hover:bg-[#1a4060] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Activity
          </button>
          <button
            onClick={onClose}
            className="px-8 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;