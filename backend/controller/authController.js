const authService = require('../service/authService');

const register = async (req, res) => {
  const { name, email, password, country, city, phone } = req.body;

  try {
    const user = await authService.register({
      name,
      email,
      password,
      country,
      city,
      phone
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        country: user.country,
        city: user.city,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, user } = await authService.login({ email, password });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { country, city, phone } = req.body;

  let profileImageUrl = null;

  if (req.file) {
    profileImageUrl = req.file.path;
  }

  try {
    const updatedUser = await authService.updateProfile(userId, {
      country,
      city,
      phone,
      profileImageUrl
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
};

const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await authService.getProfile(userId);

    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'User not found'
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  try {
    const result = await authService.forgotPassword(email);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: 'Email is Not found'
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Email, OTP, and new password are required'
    });
  }

  try {
    const result = await authService.verifyOtpAndResetPassword(email, otp, newPassword);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = { register,login, updateProfile, getProfile, forgotPassword, resetPassword };