import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, MapPin, Grid, List, Download, Share2, Edit2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
const ItineraryView = () => {
  const [viewMode, setViewMode] = useState('day');
  const navigate = useNavigate();
  const {id} = useParams();
  const itineraryData = {
    tripName: 'European Adventure',
    totalDays: 14,
    totalCost: 3500,
    destinations: [
      {
        id: 1,
        city: 'Paris',
        country: 'France',
        startDate: '2024-06-15',
        endDate: '2024-06-18',
        days: [
          {
            date: '2024-06-15',
            dayNumber: 1,
            activities: [
              { id: 1, time: '09:00 AM', name: 'Arrival & Hotel Check-in', duration: '2 hours', cost: 0, category: 'transport' },
              { id: 2, time: '12:00 PM', name: 'Lunch at Café de Flore', duration: '1.5 hours', cost: 45, category: 'meals' },
              { id: 3, time: '02:00 PM', name: 'Eiffel Tower Visit', duration: '3 hours', cost: 25, category: 'activities' },
              { id: 4, time: '06:00 PM', name: 'Seine River Cruise', duration: '2 hours', cost: 35, category: 'activities' }
            ]
          },
          {
            date: '2024-06-16',
            dayNumber: 2,
            activities: [
              { id: 5, time: '09:00 AM', name: 'Louvre Museum', duration: '4 hours', cost: 18, category: 'activities' },
              { id: 6, time: '02:00 PM', name: 'Lunch at Le Marais', duration: '1 hour', cost: 35, category: 'meals' },
              { id: 7, time: '04:00 PM', name: 'Notre-Dame Cathedral', duration: '2 hours', cost: 0, category: 'activities' },
              { id: 8, time: '07:00 PM', name: 'Dinner at Montmartre', duration: '2 hours', cost: 60, category: 'meals' }
            ]
          },
          {
            date: '2024-06-17',
            dayNumber: 3,
            activities: [
              { id: 9, time: '10:00 AM', name: 'Versailles Palace Tour', duration: '5 hours', cost: 28, category: 'activities' },
              { id: 10, time: '04:00 PM', name: 'Arc de Triomphe', duration: '1 hour', cost: 13, category: 'activities' },
              { id: 11, time: '07:00 PM', name: 'Champs-Élysées Shopping', duration: '3 hours', cost: 100, category: 'shopping' }
            ]
          }
        ]
      },
      {
        id: 2,
        city: 'Rome',
        country: 'Italy',
        startDate: '2024-06-19',
        endDate: '2024-06-22',
        days: [
          {
            date: '2024-06-19',
            dayNumber: 4,
            activities: [
              { id: 12, time: '08:00 AM', name: 'Flight to Rome', duration: '2.5 hours', cost: 150, category: 'transport' },
              { id: 13, time: '12:00 PM', name: 'Hotel Check-in & Lunch', duration: '2 hours', cost: 40, category: 'meals' },
              { id: 14, time: '03:00 PM', name: 'Colosseum Tour', duration: '2.5 hours', cost: 30, category: 'activities' }
            ]
          },
          {
            date: '2024-06-20',
            dayNumber: 5,
            activities: [
              { id: 15, time: '09:00 AM', name: 'Vatican Museums', duration: '4 hours', cost: 35, category: 'activities' },
              { id: 16, time: '02:00 PM', name: 'Sistine Chapel', duration: '2 hours', cost: 0, category: 'activities' },
              { id: 17, time: '05:00 PM', name: 'Roman Forum', duration: '2 hours', cost: 20, category: 'activities' }
            ]
          }
        ]
      }
    ]
  };

  const getCategoryColor = (category) => {
    const colors = {
      transport: 'bg-blue-100 text-blue-700',
      meals: 'bg-orange-100 text-orange-700',
      activities: 'bg-green-100 text-green-700',
      stay: 'bg-purple-100 text-purple-700',
      shopping: 'bg-pink-100 text-pink-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const calculateDayCost = (activities) => {
    return activities.reduce((sum, activity) => sum + activity.cost, 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#FDFFFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
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
              <h1 className="text-4xl font-bold text-[#235789] mb-2">{itineraryData.tripName}</h1>
              <p className="text-gray-600">{itineraryData.totalDays} days • ${itineraryData.totalCost.toLocaleString()} total budget</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/trip/${id}/build`)} className="p-3 bg-white border-2 border-[#235789] text-[#235789] rounded-xl hover:bg-gray-50 transition-colors">
                <Edit2 size={20} />
              </button>
              <button onClick={() => navigate(`/trip/${id}/budget`)} className="p-3 bg-white border-2 border-[#235789] text-[#235789] rounded-xl hover:bg-gray-50 transition-colors">
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
          {itineraryData.destinations.map((destination) => (
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
                    <span>{new Date(destination.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(destination.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{destination.days.length} days</span>
                  </div>
                </div>
              </div>

              {/* Days */}
              {viewMode === 'day' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {destination.days.map((day) => (
                    <div key={day.dayNumber} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      {/* Day Header */}
                      <div className="bg-gray-50 p-4 border-b-2 border-[#235789]">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xl font-bold text-[#235789]">Day {day.dayNumber}</span>
                          <span className="text-sm font-semibold text-gray-600">
                            ${calculateDayCost(day.activities)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{formatDate(day.date)}</p>
                      </div>

                      {/* Activities */}
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
                <div className="space-y-4">
                  {destination.days.map((day) => (
                    <div key={day.dayNumber} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      {/* Day Header */}
                      <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xl font-bold text-[#235789]">Day {day.dayNumber}</span>
                            <span className="text-gray-400 ml-3">•</span>
                            <span className="text-sm text-gray-600 ml-3">{formatDate(day.date)}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            Total: ${calculateDayCost(day.activities)}
                          </span>
                        </div>
                      </div>

                      {/* Activities List */}
                      <div className="p-4">
                        <div className="space-y-3">
                          {day.activities.map((activity, idx) => (
                            <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                              {/* Timeline */}
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 bg-[#235789] rounded-full"></div>
                                {idx < day.activities.length - 1 && (
                                  <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                                )}
                              </div>

                              {/* Time */}
                              <div className="text-sm font-semibold text-[#235789] w-20">
                                {activity.time}
                              </div>

                              {/* Activity Details */}
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 mb-1">{activity.name}</h4>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(activity.category)}`}>
                                    {activity.category}
                                  </span>
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock size={12} />
                                    <span>{activity.duration}</span>
                                  </div>
                                  {activity.cost > 0 && (
                                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                                      <DollarSign size={12} />
                                      <span>{activity.cost}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
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
              <p className="text-2xl font-bold text-[#235789]">{itineraryData.totalDays}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Destinations</p>
              <p className="text-2xl font-bold text-[#235789]">{itineraryData.destinations.length}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Total Cost</p>
              <p className="text-2xl font-bold text-[#235789]">${itineraryData.totalCost}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Avg/Day</p>
              <p className="text-2xl font-bold text-[#235789]">${Math.round(itineraryData.totalCost / itineraryData.totalDays)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;