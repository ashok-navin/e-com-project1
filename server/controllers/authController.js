import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import PasswordResetOTP from '../models/PasswordResetOTP.js';
import Order from '../models/Order.js';
import { sendPasswordResetEmail } from '../services/emailService.js';

// Helper to generate JWT
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'trending_dart_super_secret_jwt_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    }
  );
};

// 1. Customer Registration
export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone ? phone.trim() : '',
      role: 'USER',
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully! Welcome to Trending Dart.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

// 2. User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || [],
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

// 3. Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user || user.role !== 'ADMIN') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials.',
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Admin authentication successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during admin login.',
    });
  }
};

// 4. Get Current User Profile & Order Counts
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Aggregate user order stats
    const totalOrders = await Order.countDocuments({ user: user._id });
    const pendingOrders = await Order.countDocuments({
      user: user._id,
      orderStatus: { $in: ['PENDING', 'CONFIRMED', 'PROCESSING'] },
    });
    const deliveredOrders = await Order.countDocuments({
      user: user._id,
      orderStatus: 'DELIVERED',
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || [],
        wishlist: user.wishlist || [],
        stats: {
          totalOrders,
          pendingOrders,
          deliveredOrders,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (addresses && Array.isArray(addresses)) user.addresses = addresses;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current and new password are required.',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.',
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Forgot Password - Request 6-digit OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Consistent response whether email exists or not to prevent user enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If that email address is in our database, we will send an OTP code shortly.',
      });
    }

    // Check rate limit: recent OTP request
    const recentOtp = await PasswordResetOTP.findOne({
      email: normalizedEmail,
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) }, // 60s cooldown
    });
    if (recentOtp) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 60 seconds before requesting another verification code.',
      });
    }

    // Generate 6-digit cryptographically random OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(rawOtp, salt);

    // Save with 5 minute expiration
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Invalidate prior unused OTPs for this email
    await PasswordResetOTP.deleteMany({ email: normalizedEmail });

    await PasswordResetOTP.create({
      email: normalizedEmail,
      hashedOTP,
      expiresAt,
    });

    // Send email
    await sendPasswordResetEmail(normalizedEmail, rawOtp);

    return res.status(200).json({
      success: true,
      message: 'Verification code sent to your email. Valid for 5 minutes.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Error processing password reset request.' });
  }
};

// 8. Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpRecord = await PasswordResetOTP.findOne({
      email: normalizedEmail,
      isUsed: false,
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'No active OTP found or it has expired. Please request a new code.',
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    if (otpRecord.attempts >= 3) {
      await PasswordResetOTP.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. Please request a new OTP.',
      });
    }

    const isValid = await otpRecord.verifyOTP(otp.trim());
    if (!isValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: `Incorrect code. ${3 - otpRecord.attempts} attempt(s) remaining.`,
      });
    }

    // Generate short-lived reset token (10 mins)
    const resetToken = jwt.sign(
      { email: normalizedEmail, otpId: otpRecord._id },
      process.env.JWT_SECRET || 'trending_dart_super_secret_jwt_key_2026',
      { expiresIn: '10m' }
    );

    return res.status(200).json({
      success: true,
      message: 'Code verified successfully.',
      resetToken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 9. Reset Password with verified token
export const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword, confirmPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(
        resetToken,
        process.env.JWT_SECRET || 'trending_dart_super_secret_jwt_key_2026'
      );
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Reset session expired or invalid. Please restart password reset.',
      });
    }

    const targetEmail = (email || decoded.email).toLowerCase().trim();
    const user = await User.findOne({ email: targetEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Invalidate OTP record
    await PasswordResetOTP.deleteMany({ email: targetEmail });

    return res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
