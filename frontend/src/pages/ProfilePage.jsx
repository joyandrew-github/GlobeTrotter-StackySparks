import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Globe, Camera, Save, Edit2, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/auth';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    profileImage: null,
    createdAt: ''
  });

  const [editData, setEditData] = useState({ ...profileData });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/auth');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const user = response.data.data;
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        city: user.city || '',
        profileImage: user.profileImage || null,
        createdAt: user.createdAt || ''
      });
      setEditData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        city: user.city || '',
        profileImage: user.profileImage || null,
        createdAt: user.createdAt || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth');
      } else {
        setError('Failed to load profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData(prev => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const token = localStorage.getItem('token');

      const formDataToSend = new FormData();
      formDataToSend.append('name', editData.name);
      formDataToSend.append('phone', editData.phone);
      formDataToSend.append('country', editData.country);
      formDataToSend.append('city', editData.city);

      // Only append image if a new one was selected
      if (editData.profileImage && typeof editData.profileImage !== 'string') {
        formDataToSend.append('profileImage', editData.profileImage);
      }

      const response = await axios.patch(
        `${API_BASE_URL}/update-profile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const updatedUser = response.data.data;
      setProfileData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || '',
        country: updatedUser.country || '',
        city: updatedUser.city || '',
        profileImage: updatedUser.profileImage || null,
        createdAt: updatedUser.createdAt || ''
      });
      setEditData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || '',
        country: updatedUser.country || '',
        city: updatedUser.city || '',
        profileImage: updatedUser.profileImage || null,
        createdAt: updatedUser.createdAt || ''
      });

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      setPreviewUrl(null);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setPreviewUrl(null);
    setIsEditing(false);
    setError('');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDFFFC'
      }}>
        <div style={{ fontSize: '1.1rem', color: '#64748b' }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FDFFFC',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        <button
          onClick={() => window.history.back()}
          style={{
            color: '#235789',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          ← Back
        </button>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: 'clamp(1.875rem, 5vw, 2.25rem)',
            fontWeight: 'bold',
            color: '#235789',
            marginBottom: '0.5rem'
          }}>
            My Profile
          </h1>
          <p style={{ color: '#666' }}>
            Manage your personal information and account settings
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div style={{
            backgroundColor: '#dcfce7',
            color: '#166534',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #bbf7d0'
          }}>
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {/* Header with gradient */}
          <div style={{
            position: 'relative',
            height: '8rem',
            background: 'linear-gradient(to bottom right, #235789, #1a4060)'
          }}>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'white',
                  color: '#235789',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Picture */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '-4rem',
            marginBottom: '1.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ position: 'relative' }}>
              {previewUrl || profileData.profileImage ? (
                <img
                  src={previewUrl || profileData.profileImage}
                  alt="Profile"
                  style={{
                    width: '8rem',
                    height: '8rem',
                    borderRadius: '9999px',
                    border: '4px solid white',
                    objectFit: 'cover',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
              ) : (
                <div style={{
                  width: '8rem',
                  height: '8rem',
                  borderRadius: '9999px',
                  border: '4px solid white',
                  backgroundColor: '#235789',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}>
                  <span style={{
                    color: '#FDFFFC',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}>
                    {getInitials(isEditing ? editData.name : profileData.name)}
                  </span>
                </div>
              )}

              {isEditing && (
                <label style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  padding: '0.5rem',
                  backgroundColor: '#235789',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a4060'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#235789'}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <Camera size={20} style={{ color: '#FDFFFC' }} />
                </label>
              )}
            </div>
          </div>

          <div style={{
            padding: '1.5rem 1.5rem 2rem',
            paddingTop: 0
          }}>
            <div style={{ marginBottom: '2rem' }}>
              {/* Name Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#235789',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  <User size={20} style={{ marginRight: '0.5rem' }} />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#235789'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                ) : (
                  <p style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.75rem',
                    color: '#374151',
                    margin: 0
                  }}>
                    {profileData.name || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#235789',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  <Mail size={20} style={{ marginRight: '0.5rem' }} />
                  Email Address
                </label>
                <p style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.75rem',
                  color: '#374151',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  {profileData.email || 'Not provided'}
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    backgroundColor: '#d1d5db',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem'
                  }}>
                    Cannot be changed
                  </span>
                </p>
              </div>

              {/* Phone Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#235789',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  <Phone size={20} style={{ marginRight: '0.5rem' }} />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#235789'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                ) : (
                  <p style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.75rem',
                    color: '#374151',
                    margin: 0
                  }}>
                    {profileData.phone || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Location Fields */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#235789',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}>
                    <Globe size={20} style={{ marginRight: '0.5rem' }} />
                    Country
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="country"
                      value={editData.country}
                      onChange={handleInputChange}
                      placeholder="Enter your country"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#235789'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  ) : (
                    <p style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '0.75rem',
                      color: '#374151',
                      margin: 0
                    }}>
                      {profileData.country || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#235789',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}>
                    <MapPin size={20} style={{ marginRight: '0.5rem' }} />
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={editData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#235789'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  ) : (
                    <p style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '0.75rem',
                      color: '#374151',
                      margin: 0
                    }}>
                      {profileData.city || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  marginTop: '2rem'
                }}
        >
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#235789',
                      color: '#FDFFFC',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontWeight: '600',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s',
                      opacity: saving ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#1a4060')}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#235789'}
                  >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#f3f4f6',
                      color: '#235789',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontWeight: '600',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s',
                      opacity: saving ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        {profileData.createdAt && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#eff6ff',
            borderLeft: '4px solid #235789',
            borderRadius: '0.5rem'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#374151',
              margin: '0 0 0.5rem 0'
            }}>
              <strong style={{ color: '#235789' }}>Account Created:</strong> {formatDate(profileData.createdAt)}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        :root {
          --primary-color: #FDFFFC;
          --secondary-color: #235789;
        }

        * {
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          div {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
