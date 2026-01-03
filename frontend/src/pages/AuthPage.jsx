import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/auth';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        // ==================== LOGIN ====================
        if (!formData.email || !formData.password) {
          setError('Email and password are required');
          setLoading(false);
          return;
        }

        const response = await axios.post(`${API_BASE_URL}/login`, {
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        });

        const { token, user } = response.data.data;

        // Store auth data (using in-memory for artifact, use localStorage in your app)
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }

        setSuccess('Login successful! Redirecting...');

        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        // ==================== REGISTER ====================
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }

        await axios.post(`${API_BASE_URL}/register`, {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        });

        setSuccess('Account created successfully! Switching to login...');

        setTimeout(() => {
          setIsLogin(true);
          setFormData({
            name: '',
            email: formData.email,
            password: '',
            confirmPassword: ''
          });
          setSuccess('');
          setShowPassword(false);
          setShowConfirmPassword(false);
        }, 2000);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Something went wrong. Please try again.';

      setError(errorMessage);
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleForgotPassword = () => {
    alert('Forgot password feature coming soon! Check your email for reset instructions.');
  };

  // Enhanced animation variants
  const formVariants = {
    initial: { 
      opacity: 0, 
      x: isLogin ? -60 : 60,
      scale: 0.95,
      filter: 'blur(4px)'
    },
    animate: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: isLogin ? 60 : -60,
      scale: 0.95,
      filter: 'blur(4px)',
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const contentVariants = {
    initial: { 
      opacity: 0, 
      x: isLogin ? 60 : -60,
      scale: 0.95,
      filter: 'blur(4px)'
    },
    animate: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: isLogin ? -60 : 60,
      scale: 0.95,
      filter: 'blur(4px)',
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const featureVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <style jsx>{`
        :root {
          --primary-color: #FDFFFC;
          --secondary-color: #235789;
        }

        .auth-container {
          background: var(--primary-color);
          min-height: 700px;
        }

        .secondary-bg {
          background: var(--secondary-color);
        }

        .secondary-text {
          color: var(--secondary-color);
        }

        .primary-text {
          color: var(--primary-color);
        }

        .input-focus:focus {
          outline: none;
          border-color: var(--secondary-color);
          box-shadow: 0 0 0 3px rgba(35, 87, 137, 0.1);
        }

        .btn-primary {
          background: var(--secondary-color);
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: #1a4161;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(35, 87, 137, 0.2);
        }

        .form-section {
          min-height: 700px;
        }

        .content-section {
          min-height: 700px;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #6b7280;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: var(--secondary-color);
        }
      `}</style>

      <motion.div 
        className="auth-container w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* FORM SECTION */}
          <motion.div
            className={`form-section w-full md:w-1/2 p-8 lg:p-12 flex items-center justify-center ${
              isLogin ? 'md:order-1' : 'md:order-2'
            }`}
            layout
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait">
              <motion.div 
                className="w-full max-w-md"
                key={isLogin ? 'login-form' : 'signup-form'}
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {isLogin ? (
                  /* LOGIN FORM */
                  <motion.div className="space-y-8" variants={itemVariants}>
                    {error && (
                      <motion.div 
                        className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {error}
                      </motion.div>
                    )}
                    {success && (
                      <motion.div 
                        className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {success}
                      </motion.div>
                    )}
                    <motion.div variants={itemVariants}>
                      <h2 className="text-3xl font-bold secondary-text mb-2">Welcome Back, Traveler!</h2>
                      <p className="text-gray-600">Sign in to continue planning your dream adventures</p>
                    </motion.div>

                    <motion.div className="space-y-5" variants={itemVariants}>
                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <motion.input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus transition-all"
                          placeholder="traveler@example.com"
                          whileFocus={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants} className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                          <motion.input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg input-focus transition-all"
                            placeholder="••••••••"
                            whileFocus={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </motion.div>

                      <motion.div className="flex items-center justify-between" variants={itemVariants}>
                        <label className="flex items-center cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                          <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <motion.button 
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-sm secondary-text hover:underline"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Forgot password?
                        </motion.button>
                      </motion.div>

                      <motion.button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full btn-primary text-white py-3 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        variants={itemVariants}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                      >
                        {loading ? 'Signing In...' : 'Sign In to GlobeTrotter'}
                      </motion.button>
                    </motion.div>

                    <motion.div className="text-center" variants={itemVariants}>
                      <p className="text-gray-600">
                        New to GlobeTrotter?{' '}
                        <motion.button
                          type="button"
                          onClick={toggleMode}
                          className="secondary-text font-semibold hover:underline"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Create Account
                        </motion.button>
                      </p>
                    </motion.div>
                  </motion.div>
                ) : (
                  /* SIGNUP FORM */
                  <motion.div className="space-y-8" variants={itemVariants}>
                    {error && (
                      <motion.div 
                        className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {error}
                      </motion.div>
                    )}
                    {success && (
                      <motion.div 
                        className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {success}
                      </motion.div>
                    )}
                    <motion.div variants={itemVariants}>
                      <h2 className="text-3xl font-bold secondary-text mb-2">Start Your Journey</h2>
                      <p className="text-gray-600">Create an account to plan your perfect trips</p>
                    </motion.div>

                    <motion.div className="space-y-5" variants={itemVariants}>
                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <motion.input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus transition-all"
                          placeholder="John Explorer"
                          whileFocus={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <motion.input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus transition-all"
                          placeholder="explorer@example.com"
                          whileFocus={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants} className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                          <motion.input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg input-focus transition-all"
                            placeholder="••••••••"
                            whileFocus={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants} className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <div className="relative">
                          <motion.input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg input-focus transition-all"
                            placeholder="••••••••"
                            whileFocus={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </motion.div>

                      <motion.button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full btn-primary text-white py-3 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        variants={itemVariants}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                      >
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </motion.button>
                    </motion.div>

                    <motion.div className="text-center" variants={itemVariants}>
                      <p className="text-gray-600">
                        Already have an account?{' '}
                        <motion.button
                          type="button"
                          onClick={toggleMode}
                          className="secondary-text font-semibold hover:underline"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Sign In
                        </motion.button>
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* CONTENT SECTION */}
          <motion.div
            className={`content-section w-full md:w-1/2 secondary-bg p-8 lg:p-12 flex items-center justify-center ${
              isLogin ? 'md:order-2' : 'md:order-1'
            }`}
            layout
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait">
              <motion.div 
                className="w-full max-w-md"
                key={isLogin ? 'login-content' : 'signup-content'}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {isLogin ? (
                  /* LOGIN CONTENT */
                  <div className="space-y-8 text-white">
                    <motion.div variants={itemVariants}>
                      <h1 className="text-4xl lg:text-5xl font-bold primary-text mb-4">Continue Your Adventure!</h1>
                      <p className="text-blue-100 text-lg">
                        Access your personalized travel plans and pick up right where you left off.
                      </p>
                    </motion.div>

                    <motion.div className="space-y-6" variants={itemVariants}>
                      <motion.div className="flex items-start space-x-4" variants={featureVariants}>
                        <svg className="w-7 h-7 primary-text flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <div>
                          <h3 className="font-semibold primary-text">Manage Your Trips</h3>
                          <p className="text-blue-100 text-sm">Access all your saved itineraries and trip plans in one place</p>
                        </div>
                      </motion.div>

                      <motion.div className="flex items-start space-x-4" variants={featureVariants}>
                        <svg className="w-7 h-7 primary-text flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h3 className="font-semibold primary-text">Budget Tracking</h3>
                          <p className="text-blue-100 text-sm">Keep track of your travel expenses with smart cost breakdowns</p>
                        </div>
                      </motion.div>

                      <motion.div className="flex items-start space-x-4" variants={featureVariants}>
                        <svg className="w-7 h-7 primary-text flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <div>
                          <h3 className="font-semibold primary-text">Share Itineraries</h3>
                          <p className="text-blue-100 text-sm">Share your travel plans with friends and inspire others</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                ) : (
                  /* SIGNUP CONTENT */
                  <div className="space-y-8 text-white">
                    <motion.div variants={itemVariants}>
                      <h1 className="text-4xl lg:text-5xl font-bold primary-text mb-4">Dream, Design, Discover!</h1>
                      <p className="text-blue-100 text-lg">
                        Transform the way you plan travel with GlobeTrotter's intelligent platform.
                      </p>
                    </motion.div>

                    <motion.div className="space-y-6" variants={itemVariants}>
                      <motion.div className="flex items-start space-x-4" variants={featureVariants}>
                        <svg className="w-7 h-7 primary-text flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h3 className="font-semibold primary-text">Multi-City Itineraries</h3>
                          <p className="text-blue-100 text-sm">Create customized travel plans across multiple destinations</p>
                        </div>
                      </motion.div>

                      <motion.div className="flex items-start space-x-4" variants={featureVariants}>
                        <svg className="w-7 h-7 primary-text flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <h3 className="font-semibold primary-text">Visual Timeline</h3>
                          <p className="text-blue-100 text-sm">Organize your journey with interactive calendars and schedules</p>
                        </div>
                      </motion.div>

                      <motion.div className="flex items-start space-x-4" variants={featureVariants}>
                        <svg className="w-7 h-7 primary-text flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <div>
                          <h3 className="font-semibold primary-text">Discover Activities</h3>
                          <p className="text-blue-100 text-sm">Search and add activities from sightseeing to adventure sports</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;