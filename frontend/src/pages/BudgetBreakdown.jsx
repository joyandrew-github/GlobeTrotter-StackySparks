import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Calendar, Plane, Hotel, Utensils, Activity } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const BudgetBreakdown = () => {
  const navigate = useNavigate();
  const { id: tripId } = useParams();

  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category mapping from backend enum to UI display
  const categoryConfig = {
    TRANSPORT: { label: 'transport', icon: Plane, color: '#3b82f6' },
    STAY:      { label: 'accommodation', icon: Hotel, color: '#8b5cf6' },
    FOOD:      { label: 'meals', icon: Utensils, color: '#f59e0b' },
    ACTIVITY:  { label: 'activities', icon: Activity, color: '#10b981' },
    MISC:      { label: 'miscellaneous', icon: DollarSign, color: '#ec4899' },
  };

  // Helper for authenticated requests
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Helper function - defined early so it can be used anywhere
  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate) || isNaN(endDate)) return 0;
    const diff = endDate - startDate;
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
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
          throw new Error('Failed to load trip budget');
        }

        const { success, data } = await response.json();

        if (!success || !data) {
          throw new Error('Invalid trip data');
        }

        setTripData(data);
      } catch (err) {
        console.error('Error fetching trip budget:', err);
        setError(err.message || 'Could not load budget information.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFFFC] flex items-center justify-center">
        <div className="text-xl text-[#235789]">Loading budget details...</div>
      </div>
    );
  }

  if (error || !tripData) {
    return (
      <div className="min-h-screen bg-[#FDFFFC] flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-xl text-red-600 mb-4">{error || 'Failed to load budget'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#235789] text-white rounded-xl hover:bg-[#1a4060]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Extract useful data
  const totalBudget = Math.round(tripData.budget?.grandTotal || 0);
  const activitiesTotal = Math.round(tripData.budget?.activitiesTotal || 0);
  const expensesTotal = Math.round(tripData.budget?.expensesTotal || 0);
  const totalSpent = activitiesTotal + expensesTotal;

  // Build categories from real expenses
  const categories = {};
  let allocatedSum = 0;

  (tripData.expenses || []).forEach(exp => {
    const cat = categoryConfig[exp.category] || {
      label: exp.category.toLowerCase(),
      icon: DollarSign,
      color: '#6b7280'
    };

    if (!categories[cat.label]) {
      categories[cat.label] = {
        allocated: 0,
        spent: 0,
        icon: cat.icon,
        color: cat.color,
      };
    }

    categories[cat.label].spent += Number(exp.amount);
  });

  // Calculate allocated (proportional distribution as fallback)
  Object.values(categories).forEach(cat => {
    cat.allocated = Math.round((cat.spent / (totalSpent || 1)) * totalBudget) || 0;
    allocatedSum += cat.allocated;
  });

  const remaining = totalBudget - allocatedSum;
  const days = tripData.totalDays || calculateDays(tripData.startDate, tripData.endDate);
  const dailyAverage = days > 0 ? Math.round(allocatedSum / days) : 0;
  const isOverBudget = remaining < 0;

  const calculatePercentage = (amount, total) => 
    total > 0 ? Math.round((amount / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#FDFFFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-[#235789] hover:underline flex items-center gap-2 pb-4"
        >
          ← Back to Trip
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#235789] mb-2">Trip Budget & Cost Breakdown</h1>
          <p className="text-gray-600">
            {tripData.title || 'Trip'} • {days} days • {tripData.stops?.length || 0} destinations
          </p>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Total Budget</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign size={20} className="text-[#235789]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#235789] mb-1">${totalBudget.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Planned budget</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Estimated</h3>
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-1">${allocatedSum.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{calculatePercentage(allocatedSum, totalBudget)}% of budget</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Remaining</h3>
              <div className={`p-2 rounded-lg ${isOverBudget ? 'bg-red-50' : 'bg-green-50'}`}>
                {isOverBudget ? (
                  <TrendingDown size={20} className="text-red-600" />
                ) : (
                  <TrendingUp size={20} className="text-green-600" />
                )}
              </div>
            </div>
            <p className={`text-3xl font-bold mb-1 ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              ${Math.abs(remaining).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">{isOverBudget ? 'Over budget' : 'Available'}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Daily Average</h3>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Calendar size={20} className="text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-1">${dailyAverage}</p>
            <p className="text-sm text-gray-500">Per day estimate</p>
          </div>
        </div>

        {/* Over Budget Alert */}
        {isOverBudget && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertTriangle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-800 mb-1">Budget Alert</h3>
              <p className="text-sm text-red-700">
                You're ${Math.abs(remaining).toLocaleString()} over your planned budget.
                Consider reviewing expenses or increasing the total budget.
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Category Breakdown + Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#235789] mb-6">Expense Categories</h2>
              
              {Object.keys(categories).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(categories).map(([key, category]) => {
                    const Icon = category.icon;
                    const percentage = calculatePercentage(category.allocated, allocatedSum);

                    return (
                      <div key={key} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${category.color}20` }}
                            >
                              <Icon size={20} style={{ color: category.color }} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 capitalize">{category.label}</h3>
                              <p className="text-sm text-gray-500">{percentage}% of estimate</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-[#235789]">
                              ${category.allocated.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${Math.round(category.spent)} spent
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: category.color
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No expense categories recorded yet
                </div>
              )}
            </div>

            {/* Detailed Expenses Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#235789] mb-6">All Recorded Expenses</h2>
              
              {tripData.expenses?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Category</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Note</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tripData.expenses.map((exp) => (
                        <tr key={exp.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium capitalize">
                            {exp.category.toLowerCase()}
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {exp.note || '—'}
                          </td>
                          <td className="text-right py-4 px-4 font-semibold text-gray-700">
                            ${Number(exp.amount).toLocaleString()}
                          </td>
                          <td className="text-right py-4 px-4 text-gray-500">
                            {new Date(exp.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No expenses recorded yet. Add some to see detailed breakdown!
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Summary & Tips */}
          <div className="space-y-6">
            {/* Budget Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#235789] mb-6">Budget Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Activities Cost</span>
                  <span className="font-bold text-[#235789]">${activitiesTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Expenses Recorded</span>
                  <span className="font-bold text-[#235789]">${expensesTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Budget Utilization</span>
                  <span className="font-bold text-[#235789]">{calculatePercentage(allocatedSum, totalBudget)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Trip Duration</span>
                  <span className="font-bold text-[#235789]">{days} days</span>
                </div>
              </div>
            </div>

            {/* Budget Tips */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="font-bold text-[#235789] mb-3">Budget Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#235789] mt-1">•</span>
                  <span>Track small daily expenses — they add up quickly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#235789] mt-1">•</span>
                  <span>Keep 10-15% buffer for unexpected costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#235789] mt-1">•</span>
                  <span>Use local transport and eat where locals eat</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetBreakdown;