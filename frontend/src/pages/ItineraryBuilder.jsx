import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Plus, X, GripVertical, Edit2, Trash2, DollarSign, Save } from 'lucide-react';

const ItineraryBuilder = () => {
  const [tripStops, setTripStops] = useState([
    {
      id: 1,
      city: 'Paris',
      country: 'France',
      startDate: '2024-06-15',
      endDate: '2024-06-18',
      activities: [
        { id: 1, name: 'Eiffel Tower Visit', time: '09:00 AM', duration: '3 hours', cost: 25 },
        { id: 2, name: 'Louvre Museum', time: '02:00 PM', duration: '4 hours', cost: 18 }
      ]
    },
    {
      id: 2,
      city: 'Rome',
      country: 'Italy',
      startDate: '2024-06-19',
      endDate: '2024-06-22',
      activities: [
        { id: 3, name: 'Colosseum Tour', time: '10:00 AM', duration: '2 hours', cost: 30 }
      ]
    }
  ]);

  const [showAddStop, setShowAddStop] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  const addNewStop = () => {
    setShowAddStop(true);
  };

  const handleAddStop = (newStop) => {
    setTripStops([...tripStops, { ...newStop, id: Date.now(), activities: [] }]);
    setShowAddStop(false);
  };

  const removeStop = (stopId) => {
    if (window.confirm('Remove this stop from your itinerary?')) {
      setTripStops(tripStops.filter(stop => stop.id !== stopId));
    }
  };

  const addActivity = (stopId, activity) => {
    setTripStops(tripStops.map(stop => 
      stop.id === stopId 
        ? { ...stop, activities: [...stop.activities, { ...activity, id: Date.now() }] }
        : stop
    ));
    setShowAddActivity(null);
  };

  const removeActivity = (stopId, activityId) => {
    setTripStops(tripStops.map(stop => 
      stop.id === stopId 
        ? { ...stop, activities: stop.activities.filter(a => a.id !== activityId) }
        : stop
    ));
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

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const calculateStopCost = (activities) => {
    return activities.reduce((sum, activity) => sum + activity.cost, 0);
  };

  const calculateDuration = (startDate, endDate) => {
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-[#FDFFFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#235789] mb-2">Build Your Itinerary</h1>
          <p className="text-gray-600">Add destinations and activities to create your perfect trip</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={addNewStop}
            className="flex items-center gap-2 px-6 py-3 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold hover:bg-[#1a4060] transition-colors shadow-lg"
          >
            <Plus size={20} />
            Add Destination
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-[#235789] border-2 border-[#235789] rounded-xl font-semibold hover:bg-gray-50 transition-colors">
            <Save size={20} />
            Save Itinerary
          </button>
        </div>

        {/* Itinerary Timeline */}
        <div className="space-y-6">
          {tripStops.map((stop, index) => (
            <div
              key={stop.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all ${
                draggedItem === index ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {/* Stop Header */}
              <div className="bg-gradient-to-r from-[#235789] to-[#1a4060] p-6 text-[#FDFFFC]">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <button className="cursor-move mt-1 hover:scale-110 transition-transform">
                      <GripVertical size={24} />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                          Stop {index + 1}
                        </span>
                        <span className="text-sm opacity-90">
                          {calculateDuration(stop.startDate, stop.endDate)}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{stop.city}</h3>
                      <p className="text-sm opacity-90 mb-3">{stop.country}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{new Date(stop.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(stop.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} />
                          <span>${calculateStopCost(stop.activities)}</span>
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

              {/* Activities */}
              <div className="p-6">
                {stop.activities.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {stop.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#235789] mb-2">{activity.name}</h4>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock size={14} />
                              <span>{activity.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={14} />
                              <span>{activity.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign size={14} />
                              <span>${activity.cost}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeActivity(stop.id, activity.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <MapPin size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No activities added yet</p>
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
          ))}

          {tripStops.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <MapPin size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No destinations added yet</h3>
              <p className="text-gray-500 mb-6">Start building your itinerary by adding your first destination</p>
              <button
                onClick={addNewStop}
                className="px-6 py-3 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold hover:bg-[#1a4060] transition-colors"
              >
                Add First Destination
              </button>
            </div>
          )}
        </div>

        {/* Add Stop Modal */}
        {showAddStop && (
          <AddStopModal
            onClose={() => setShowAddStop(false)}
            onAdd={handleAddStop}
          />
        )}

        {/* Add Activity Modal */}
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

// Add Stop Modal Component
const AddStopModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    city: '',
    country: '',
    startDate: '',
    endDate: ''
  });

  const handleSubmit = () => {
    if (formData.city && formData.country && formData.startDate && formData.endDate) {
      onAdd(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#235789]">Add Destination</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#235789] mb-2">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789]"
              placeholder="e.g., Paris"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#235789] mb-2">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789]"
              placeholder="e.g., France"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#235789] mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#235789] mb-2">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789]"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold hover:bg-[#1a4060] transition-colors"
          >
            Add Destination
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Activity Modal Component
const AddActivityModal = ({ stopId, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    duration: '',
    cost: 0
  });

  const handleSubmit = () => {
    if (formData.name && formData.time) {
      onAdd(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#235789]">Add Activity</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#235789] mb-2">Activity Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789]"
              placeholder="e.g., Eiffel Tower Visit"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#235789] mb-2">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#235789] mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789]"
                placeholder="e.g., 2 hours"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#235789] mb-2">Cost ($)</label>
            <input
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789]"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold hover:bg-[#1a4060] transition-colors"
          >
            Add Activity
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;