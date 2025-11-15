const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Item = require('../models/Item');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's items
    const items = await Item.find({ seller: req.params.id, isAvailable: true })
      .sort({ createdAt: -1 })
      .limit(20);

    // Get reviews and calculate average rating
    const reviews = await Review.find({ reviewedUser: req.params.id })
      .populate('reviewer', 'name profileImage')
      .sort({ createdAt: -1 });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
    const ratingCount = reviews.length;

    res.json({
      user,
      items,
      reviews,
      averageRating: parseFloat(averageRating),
      ratingCount
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id/items
// @desc    Get user's items
// @access  Public
router.get('/:id/items', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const items = await Item.find({ seller: req.params.id, isAvailable: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Item.countDocuments({ seller: req.params.id, isAvailable: true });

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/:id/reviews
// @desc    Create a review for a user
// @access  Private
router.post('/:id/reviews', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const reviewedUserId = req.params.id;
    const reviewerId = req.userId;

    // Prevent users from reviewing themselves
    if (reviewedUserId === reviewerId) {
      return res.status(400).json({ message: 'You cannot review yourself' });
    }

    // Check if user exists
    const reviewedUser = await User.findById(reviewedUserId);
    if (!reviewedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ reviewer: reviewerId, reviewedUser: reviewedUserId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this user' });
    }

    const { rating, comment } = req.body;

    const review = new Review({
      reviewer: reviewerId,
      reviewedUser: reviewedUserId,
      rating: Number(rating),
      comment: comment || ''
    });

    await review.save();
    await review.populate('reviewer', 'name profileImage');

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this user' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id/reviews
// @desc    Get reviews for a user
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ reviewedUser: req.params.id })
      .populate('reviewer', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments({ reviewedUser: req.params.id });

    // Calculate average rating
    const allReviews = await Review.find({ reviewedUser: req.params.id });
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = allReviews.length > 0 ? (totalRating / allReviews.length).toFixed(1) : 0;

    res.json({
      reviews,
      averageRating: parseFloat(averageRating),
      totalReviews: allReviews.length,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile (including profile image)
// @access  Private
router.put('/profile', auth, upload.single('profileImage'), async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, phone } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (req.file) {
      user.profileImage = req.file.filename;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university,
        phone: user.phone,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

