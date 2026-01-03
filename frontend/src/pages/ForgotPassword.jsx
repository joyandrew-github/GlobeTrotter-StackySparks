import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/auth';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Email Submission
  const handleEmailSubmit = async () => {
    setErrors({});
    setSuccessMessage('');

    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
        email: email.trim().toLowerCase()
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          setStep(2);
          setSuccessMessage('');
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrors({
        email: error.response?.data?.message || 'Failed to send OTP. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // Handle OTP Verification
  const handleOtpSubmit = async () => {
    setErrors({});
    setSuccessMessage('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit OTP' });
      return;
    }

    // Proceed to password reset step without verifying OTP separately
    // OTP will be verified when resetting password
    setStep(3);
  };

  // Handle Password Reset
  const handlePasswordSubmit = async () => {
    setErrors({});
    setSuccessMessage('');

    if (!newPassword) {
      setErrors({ newPassword: 'Password is required' });
      return;
    }

    if (newPassword.length < 8) {
      setErrors({ newPassword: 'Password must be at least 8 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    try {
      setLoading(true);
      const otpString = otp.join('');

      const response = await axios.post(`${API_BASE_URL}/reset-password`, {
        email: email.trim().toLowerCase(),
        otp: otpString,
        newPassword: newPassword
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setStep(4); // Show success screen
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/auth';
        }, 2000);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setErrors({
        password: error.response?.data?.message || 'Failed to reset password. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setErrors({});
    setSuccessMessage('');
    setOtp(['', '', '', '', '', '']);

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
        email: email.trim().toLowerCase()
      });

      if (response.data.success) {
        setSuccessMessage('OTP has been resent to your email');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setErrors({
        otp: error.response?.data?.message || 'Failed to resend OTP. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, handler) => {
    if (e.key === 'Enter') {
      handler();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFFFC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Back Button */}
        {step > 1 && step < 4 && (
          <button
            onClick={() => setStep(step - 1)}
            className="text-[#235789] hover:underline flex items-center gap-2 mb-6"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {successMessage}
          </div>
        )}

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#235789] rounded-full mb-4">
                <Mail size={32} className="text-[#FDFFFC]" />
              </div>
              <h2 className="text-3xl font-bold text-[#235789] mb-2">
                Forgot Password?
              </h2>
              <p className="text-gray-600">
                Enter your email address and we'll send you an OTP to reset your password
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[#235789] font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleEmailSubmit)}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#235789] transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <button
                onClick={handleEmailSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold hover:bg-[#1a4060] transition-colors shadow-lg disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="mt-6 text-center">
              <a href="/login" className="text-[#235789] hover:underline text-sm">
                Remember your password? Login
              </a>
            </div>
          </div>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#235789] rounded-full mb-4">
                <Mail size={32} className="text-[#FDFFFC]" />
              </div>
              <h2 className="text-3xl font-bold text-[#235789] mb-2">
                Enter OTP
              </h2>
              <p className="text-gray-600">
                We've sent a 6-digit code to
              </p>
              <p className="text-[#235789] font-semibold mt-1">{email}</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[#235789] font-semibold mb-4 text-center">
                  Enter 6-Digit OTP
                </label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:border-[#235789] transition-colors ${
                        errors.otp ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                  ))}
                </div>
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-2 text-center">{errors.otp}</p>
                )}
              </div>

              <button
                onClick={handleOtpSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold hover:bg-[#1a4060] transition-colors shadow-lg disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
                <ArrowRight size={20} />
              </button>

              <div className="text-center">
                <button
                  onClick={handleResendOtp}
                  className="text-[#235789] hover:underline text-sm"
                >
                  Didn't receive the code? Resend OTP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#235789] rounded-full mb-4">
                <Lock size={32} className="text-[#FDFFFC]" />
              </div>
              <h2 className="text-3xl font-bold text-[#235789] mb-2">
                Reset Password
              </h2>
              <p className="text-gray-600">
                Enter your new password below
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[#235789] font-semibold mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handlePasswordSubmit)}
                  placeholder="Enter new password"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#235789] transition-colors ${
                    errors.newPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-[#235789] font-semibold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handlePasswordSubmit)}
                  placeholder="Confirm new password"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#235789] transition-colors ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                onClick={handlePasswordSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#235789] text-[#FDFFFC] rounded-xl font-semibold hover:bg-[#1a4060] transition-colors shadow-lg disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-[#235789] mb-2">
                Success!
              </h2>
              <p className="text-gray-600 mb-6">
                Your password has been reset successfully.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login page...
              </p>
            </div>
          </div>
        )}

        {/* Info Card */}
        {step === 1 && (
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-[#235789] rounded-lg">
            <p className="text-sm text-gray-700">
              <strong className="text-[#235789]">Security Tip:</strong> Make sure to use a strong password with at least 8 characters, including letters, numbers, and special characters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;