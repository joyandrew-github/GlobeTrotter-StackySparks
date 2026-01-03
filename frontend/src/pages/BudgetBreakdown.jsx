import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Calendar, Plane, Hotel, Utensils, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const BudgetBreakdown = () => {
  const [budget] = useState({
    total: 3500,
    allocated: 3200,
    spent: 0,
    categories: {
      transport: { allocated: 800, spent: 0, icon: Plane, color: '#3b82f6' },
      accommodation: { allocated: 1200, spent: 0, icon: Hotel, color: '#8b5cf6' },
      meals: { allocated: 600, spent: 0, icon: Utensils, color: '#f59e0b' },
      activities: { allocated: 400, spent: 0, icon: Activity, color: '#10b981' },
      shopping: { allocated: 200, spent: 0, icon: DollarSign, color: '#ec4899' }
    }
  });
const navigate = useNavigate();
  const [tripDetails] = useState({
    name: 'European Adventure',
    days: 14,
    destinations: 5,
    startDate: '2024-06-15'
  });

  const remaining = budget.total - budget.allocated;
  const dailyAverage = budget.allocated / tripDetails.days;
  const isOverBudget = budget.allocated > budget.total;

  const calculatePercentage = (amount, total) => {
    return Math.round((amount / total) * 100);
  };

  return (
    <div className="min-h-screen bg-[#FDFFFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button 
            onClick={() => navigate(-1)}
            className="text-[#235789] hover:underline flex items-center gap-2 pb-4"
        >
            ← Back
        </button>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#235789] mb-2">Trip Budget & Cost Breakdown</h1>
          <p className="text-gray-600">{tripDetails.name} • {tripDetails.days} days</p>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Budget */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Total Budget</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign size={20} className="text-[#235789]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#235789] mb-1">${budget.total.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Set budget limit</p>
          </div>

          {/* Allocated */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Allocated</h3>
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-1">${budget.allocated.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{calculatePercentage(budget.allocated, budget.total)}% of budget</p>
          </div>

          {/* Remaining */}
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

          {/* Daily Average */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Daily Average</h3>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Calendar size={20} className="text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-1">${Math.round(dailyAverage)}</p>
            <p className="text-sm text-gray-500">Per day budget</p>
          </div>
        </div>

        {/* Over Budget Alert */}
        {isOverBudget && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertTriangle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-800 mb-1">Budget Alert</h3>
              <p className="text-sm text-red-700">
                You're ${Math.abs(remaining).toLocaleString()} over budget. Consider adjusting your expenses or increasing your total budget.
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Category Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#235789] mb-6">Expense Categories</h2>
              
              <div className="space-y-6">
                {Object.entries(budget.categories).map(([key, category]) => {
                  const Icon = category.icon;
                  const percentage = calculatePercentage(category.allocated, budget.allocated);
                  
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
                            <h3 className="font-semibold text-gray-800 capitalize">{key}</h3>
                            <p className="text-sm text-gray-500">{percentage}% of total</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-[#235789]">
                            ${category.allocated.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${category.spent} spent
                          </p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
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
            </div>

            {/* Detailed Breakdown Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#235789] mb-6">Detailed Expenses</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Category</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Allocated</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Spent</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Remaining</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(budget.categories).map(([key, category]) => {
                      const remaining = category.allocated - category.spent;
                      const isOver = remaining < 0;
                      
                      return (
                        <tr key={key} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="font-medium text-gray-800 capitalize">{key}</span>
                            </div>
                          </td>
                          <td className="text-right py-4 px-4 font-semibold text-gray-700">
                            ${category.allocated}
                          </td>
                          <td className="text-right py-4 px-4 text-gray-600">
                            ${category.spent}
                          </td>
                          <td className={`text-right py-4 px-4 font-semibold ${isOver ? 'text-red-600' : 'text-green-600'}`}>
                            ${Math.abs(remaining)}
                          </td>
                          <td className="text-right py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              isOver ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {isOver ? 'Over' : 'On Track'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Budget Chart & Summary */}
          <div className="space-y-6">
            {/* Pie Chart Visualization */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#235789] mb-6">Budget Distribution</h2>
              
              <div className="relative w-full aspect-square max-w-xs mx-auto mb-6">
                <svg viewBox="0 0 200 200" className="transform -rotate-90">
                  {(() => {
                    let currentAngle = 0;
                    return Object.entries(budget.categories).map(([key, category]) => {
                      const percentage = category.allocated / budget.allocated;
                      const angle = percentage * 360;
                      const largeArcFlag = angle > 180 ? 1 : 0;
                      
                      const startX = 100 + 90 * Math.cos((currentAngle * Math.PI) / 180);
                      const startY = 100 + 90 * Math.sin((currentAngle * Math.PI) / 180);
                      
                      currentAngle += angle;
                      
                      const endX = 100 + 90 * Math.cos((currentAngle * Math.PI) / 180);
                      const endY = 100 + 90 * Math.sin((currentAngle * Math.PI) / 180);
                      
                      return (
                        <path
                          key={key}
                          d={`M 100 100 L ${startX} ${startY} A 90 90 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                          fill={category.color}
                          opacity="0.9"
                        />
                      );
                    });
                  })()}
                  <circle cx="100" cy="100" r="60" fill="#FDFFFC" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold text-[#235789]">${budget.allocated}</p>
                  <p className="text-sm text-gray-600">Total Allocated</p>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                {Object.entries(budget.categories).map(([key, category]) => {
                  const percentage = calculatePercentage(category.allocated, budget.allocated);
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#235789] mb-4">Quick Stats</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Cost per day</span>
                  <span className="font-bold text-[#235789]">${Math.round(dailyAverage)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Cost per destination</span>
                  <span className="font-bold text-[#235789]">${Math.round(budget.allocated / tripDetails.destinations)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Budget utilization</span>
                  <span className="font-bold text-[#235789]">{calculatePercentage(budget.allocated, budget.total)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Trip duration</span>
                  <span className="font-bold text-[#235789]">{tripDetails.days} days</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="font-bold text-[#235789] mb-3">Budget Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#235789] mt-1">•</span>
                  <span>Book accommodations and flights early for better rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#235789] mt-1">•</span>
                  <span>Set aside 10-15% for unexpected expenses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#235789] mt-1">•</span>
                  <span>Use local transportation to save on travel costs</span>
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