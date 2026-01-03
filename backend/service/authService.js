const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendOtpEmail } = require('../config/email');

const DEFAULT_PROFILE_IMAGE = 'https://i.pravatar.cc/300';

const register = async ({ name, email, password, country, city, phone }) => {
  if (!name || !email || !password) {
    throw new Error('Name, email and password are required');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      profileImage: DEFAULT_PROFILE_IMAGE,
      country: country || null,
      city: city || null,
      phone: phone || null
    }
  });

  return user;
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn:'7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      country: user.country,
      city: user.city,
      phone: user.phone,
      createdAt: user.createdAt
    }
  };
};

const updateProfile = async (userId, { country, city, phone, profileImageUrl }) => {
  const data = {};
  if (country !== undefined) data.country = country || null;
  if (city !== undefined) data.city = city || null;
  if (phone !== undefined) data.phone = phone || null;
  if (profileImageUrl) data.profileImage = profileImageUrl;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      country: true,
      city: true,
      phone: true,
      createdAt: true
    }
  });

  return updatedUser;
};


const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      country: true,
      city: true,
      phone: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) {
    throw new Error('You are not registered with this email');
  }

  const otp = generateOtp();
  const expires = new Date(Date.now() + Number(process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetOtp: otp,
      resetOtpExpires: expires
    }
  });

  await sendOtpEmail(user.email, otp);

  return { message: 'OTP sent successfully' };
};

const verifyOtpAndResetPassword = async (email, otp, newPassword) => {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters');
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) {
    throw new Error('Invalid or expired OTP');
  }

  if (user.resetOtp !== otp || !user.resetOtpExpires || user.resetOtpExpires < new Date()) {
    throw new Error('Invalid or expired OTP');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetOtp: null,
      resetOtpExpires: null
    }
  });

  return { message: 'Password reset successfully' };
};

module.exports = { register,login, updateProfile, getProfile, forgotPassword, verifyOtpAndResetPassword };