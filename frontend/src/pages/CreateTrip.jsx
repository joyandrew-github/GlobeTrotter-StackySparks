import React, { useState } from 'react';
import { Calendar, MapPin, FileText, Save, X, Upload, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// React Toastify imports
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateTrip = () => {
  const navigate = useNavigate();

  const [tripData, setTripData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    isPublic: false
  });
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleTogglePublic = () => {
    setTripData(prev => ({
      ...prev,
      isPublic: !prev.isPublic
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setCoverPhoto(null);
    setPreviewUrl(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!tripData.title.trim()) {
      newErrors.title = 'Trip name is required';
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setServerError('');

    const formData = new FormData();
    formData.append('title', tripData.title.trim());
    formData.append('description', tripData.description.trim());
    formData.append('startDate', tripData.startDate);
    formData.append('endDate', tripData.endDate);
    formData.append('isPublic', tripData.isPublic);

    if (coverPhoto) {
      formData.append('coverImage', coverPhoto);
    }

    try {
      const response = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: formData,
        credentials: 'include'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create trip');
      }

      const newTripId = result.data?.id;

      // Success Toast
      toast.success('Trip created successfully! 🎉', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form
      setTripData({
        title: '',
        startDate: '',
        endDate: '',
        description: '',
        isPublic: false
      });
      setCoverPhoto(null);
      setPreviewUrl(null);
      setErrors({});

      // Navigate after a short delay to let toast show
      setTimeout(() => {
        navigate(`/trip/${newTripId}/build`);
      }, 800);

    } catch (err) {
      // Error Toast
      toast.error(err.message || 'Failed to create trip. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTripData({
      title: '',
      startDate: '',
      endDate: '',
      description: '',
      isPublic: false
    });
    setCoverPhoto(null);
    setPreviewUrl(null);
    setErrors({});
    setServerError('');
  };

  return (
    <div className="min-h-screen bg-[#FDFFFC] py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-[#235789] hover:underline flex items-center gap-2 mb-4"
        >
          ← Back
        </button>

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
            {serverError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {serverError}
              </div>
            )}

            <div>
              <label className="flex items-center text-[#235789] font-semibold mb-2">
                <MapPin size={20} className="mr-2" />
                Trip Name *
              </label>
              <input
                type="text"
                name="title"
                value={tripData.title}
                onChange={handleInputChange}
                placeholder="e.g., Summer Europe Adventure"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#235789] transition-colors ${
                  errors.title ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
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
                placeholder="Tell us about your trip plans, places you want to visit, activities..."
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#235789] transition-colors resize-none"
              />
            </div>

            {/* Public Toggle */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div>
                <p className="font-semibold text-[#235789]">Make Trip Public</p>
                <p className="text-sm text-gray-600 mt-1">
                  {tripData.isPublic
                    ? "Others will be able to view your trip itinerary"
                    : "Your trip will remain private (only you can see it)"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleTogglePublic}
                disabled={loading}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#235789] focus:ring-offset-2 ${
                  tripData.isPublic ? 'bg-[#235789]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    tripData.isPublic ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold hover:bg-[#1a4060] transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                {loading ? 'Creating Trip...' : 'Create Trip'}
              </button>
              <button
                onClick={handleClear}
                disabled={loading}
                className="px-6 py-3 bg-gray-100 text-[#235789] rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-70"
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

      {/* Toast Container - Local to this page only */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default CreateTrip;