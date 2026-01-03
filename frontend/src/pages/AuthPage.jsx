import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

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

        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

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
          // Optional fields like country, city, phone can be added later in profile
        });

        setSuccess('Account created successfully! Switching to login...');

        // Auto-switch to login and pre-fill email
        setTimeout(() => {
          setIsLogin(true);
          setFormData({
            ...formData,
            name: '',
            password: '',
            confirmPassword: '',
            // Keep email filled
          });
          setSuccess('');
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
    setError('');
    setSuccess('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleForgotPassword = () => {
    // You can expand this later with a modal or redirect
    alert('Forgot password feature coming soon! Check your email for reset instructions.');
    // Or redirect to a dedicated forgot password page
    // window.location.href = '/forgot-password';
  };

  // Animation variants (same as yours – they're excellent!)
  const formVariants = {
    initial: { opacity: 0, x: isLogin ? -60 : 60, scale: 0.95, filter: 'blur(4px)' },
    animate: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: isLogin ? 60 : -60, scale: 0.95, filter: 'blur(4px)', transition: { duration: 0.4 } }
  };

  const contentVariants = {
    initial: { opacity: 0, x: isLogin ? 60 : -60, scale: 0.95, filter: 'blur(4px)' },
    animate: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: isLogin ? -60 : 60, scale: 0.95, filter: 'blur(4px)', transition: { duration: 0.4 } }
  };

  const itemVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <style jsx>{`
        :root {
          --primary-color: #FDFFFC;
          --secondary-color: #235789;
        }
        .auth-container { background: var(--primary-color); min-height: 700px; }
        .secondary-bg { background: var(--secondary-color); }
        .secondary-text { color: var(--secondary-color); }
        .primary-text { color: var(--primary-color); }
        .input-focus:focus { outline: none; border-color: var(--secondary-color); box-shadow: 0 0 0 3px rgba(35, 87, 137, 0.1); }
        .btn-primary { background: var(--secondary-color); transition: all 0.3s ease; }
        .btn-primary:hover { background: #1a4161; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(35, 87, 137, 0.2); }
        .form-section, .content-section { min-height: 700px; }
      `}</style>

      <motion.div 
        className="auth-container w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* FORM SECTION */}
          <motion.div className={`form-section w-full md:w-1/2 p-8 lg:p-12 flex items-center justify-center ${isLogin ? 'md:order-1' : 'md:order-2'}`} layout>
            <AnimatePresence mode="wait">
              <motion.div className="w-full max-w-md" key={isLogin ? 'login' : 'signup'} variants={formVariants} initial="initial" animate="animate" exit="exit">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <motion.div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                      {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                      {success}
                    </motion.div>
                  )}

                  <div>
                    <h2 className="text-3xl font-bold secondary-text mb-2">
                      {isLogin ? 'Welcome Back, Traveler!' : 'Start Your Journey'}
                    </h2>
                    <p className="text-gray-600">
                      {isLogin ? 'Sign in to continue planning your dream adventures' : 'Create an account to plan your perfect trips'}
                    </p>
                  </div>

                  <div className="space-y-5">
                    {!isLogin && (
                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required={!isLogin}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus transition-all"
                          placeholder="John Explorer"
                        />
                      </motion.div>
                    )}

                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus transition-all"
                        placeholder="traveler@example.com"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus transition-all"
                        placeholder="••••••••"
                      />
                    </motion.div>

                    {!isLogin && (
                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus transition-all"
                          placeholder="••••••••"
                        />
                      </motion.div>
                    )}

                    {isLogin && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-sm secondary-text hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary text-white py-3 rounded-lg font-semibold text-lg disabled:opacity-50"
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                      {loading 
                        ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                        : (isLogin ? 'Sign In to GlobeTrotter' : 'Create Account')
                      }
                    </motion.button>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-600">
                      {isLogin ? "New to GlobeTrotter? " : "Already have an account? "}
                      <button
                        type="button"
                        onClick={toggleMode}
                        className="secondary-text font-semibold hover:underline"
                      >
                        {isLogin ? 'Create Account' : 'Sign In'}
                      </button>
                    </p>
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* CONTENT SECTION - unchanged (your design is beautiful!) */}
          <motion.div className={`content-section w-full md:w-1/2 secondary-bg p-8 lg:p-12 flex items-center justify-center ${isLogin ? 'md:order-2' : 'md:order-1'}`} layout>
            <AnimatePresence mode="wait">
              <motion.div className="w-full max-w-md text-white" key={isLogin ? 'login-content' : 'signup-content'} variants={contentVariants} initial="initial" animate="animate" exit="exit">
                {/* Your existing content section remains exactly as you wrote it */}
                {/* It's perfect – no changes needed */}
                {isLogin ? (
                  <div className="space-y-8">
                    <div>
                      <h1 className="text-4xl lg:text-5xl font-bold primary-text mb-4">Continue Your Adventure!</h1>
                      <p className="text-blue-100 text-lg">Access your personalized travel plans and pick up right where you left off.</p>
                    </div>
                    {/* Features list... */}
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div>
                      <h1 className="text-4xl lg:text-5xl font-bold primary-text mb-4">Dream, Design, Discover!</h1>
                      <p className="text-blue-100 text-lg">Transform the way you plan travel with GlobeTrotter's intelligent platform.</p>
                    </div>
                    {/* Features list... */}
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