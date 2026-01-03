import React, { useState } from 'react';
import { Calendar, MapPin, FileText, Save, X, Upload } from 'lucide-react';

const CreateTrip = () => {
  const [tripData, setTripData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    coverPhoto: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTripData(prev => ({ ...prev, coverPhoto: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setTripData(prev => ({ ...prev, coverPhoto: null }));
    setPreviewUrl(null);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!tripData.name.trim()) {
      newErrors.name = 'Trip name is required';
    }
    
    if (!tripData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!tripData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (tripData.startDate && tripData.endDate) {
      if (new Date(tripData.endDate) < new Date(tripData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Trip created:', tripData);
      alert('Trip created successfully!');
      setTripData({
        name: '',
        startDate: '',
        endDate: '',
        description: '',
        coverPhoto: null
      });
      setPreviewUrl(null);
    }
  };

  const handleClear = () => {
    setTripData({
      name: '',
      startDate: '',
      endDate: '',
      description: '',
      coverPhoto: null
    });
    setPreviewUrl(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#FDFFFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#235789] mb-2">
            Create New Trip
          </h1>
          <p className="text-gray-600">
            Start planning your next adventure by filling in the details below
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-64 bg-gradient-to-br from-[#235789] to-[#1a4060]">
            {previewUrl ? (
              <>
                <img 
                  src={previewUrl} 
                  alt="Cover preview" 
                  className="w-full h-full object-cover opacity-70"
                />
                <button
                  onClick={removePhoto}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-[#235789]" />
                </button>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-[#1a4060] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload size={48} className="text-[#FDFFFC] mb-4 opacity-80" />
                <span className="text-[#FDFFFC] text-lg font-medium">Upload Cover Photo</span>
                <span className="text-[#FDFFFC] text-sm opacity-70 mt-2">Optional</span>
              </label>
            )}
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <label className="flex items-center text-[#235789] font-semibold mb-2">
                <MapPin size={20} className="mr-2" />
                Trip Name *
              </label>
              <input
                type="text"
                name="name"
                value={tripData.name}
                onChange={handleInputChange}
                placeholder="e.g., Summer Europe Adventure"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#235789] transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-[#235789] font-semibold mb-2">
                  <Calendar size={20} className="mr-2" />
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={tripData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#235789] transition-colors ${
                    errors.startDate ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-[#235789] font-semibold mb-2">
                  <Calendar size={20} className="mr-2" />
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={tripData.endDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#235789] transition-colors ${
                    errors.endDate ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center text-[#235789] font-semibold mb-2">
                <FileText size={20} className="mr-2" />
                Description
              </label>
              <textarea
                name="description"
                value={tripData.description}
                onChange={handleInputChange}
                placeholder="Tell us about your trip plans, places you want to visit, activities you're interested in..."
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789] transition-colors resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold hover:bg-[#1a4060] transition-colors shadow-lg"
              >
                <Save size={20} />
                Create Trip
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-gray-100 text-[#235789] rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-[#235789] rounded-lg">
          <p className="text-sm text-gray-700">
            <strong className="text-[#235789]">Tip:</strong> After creating your trip, you'll be able to add destinations, activities, and manage your budget in the trip details page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;