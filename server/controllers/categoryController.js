import Category from '../models/Category.js';
import mongoose from 'mongoose';

const FALLBACK_CATEGORIES = [
  { _id: 'cat-1', name: 'Bathroom Essentials', description: 'Hygienic wall-mounted organizers, soap holders, and drain racks', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', isActive: true },
  { _id: 'cat-2', name: 'Home Organizers', description: 'Smart space-saving storage racks and counter protectors', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', isActive: true },
  { _id: 'cat-3', name: 'Smart Utility', description: 'No-drill wall fixtures, self-adhesive clips, and handy home tools', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80', isActive: true },
  { _id: 'cat-4', name: 'Kitchen Gadgets', description: 'Trending oil dispensers, sink drainers, and spice racks', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80', isActive: true },
];

export const getCategories = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const categories = await Category.find({ isActive: true }).sort({ name: 1 });
      if (categories && categories.length > 0) {
        return res.status(200).json({ success: true, categories });
      }
    }
    return res.status(200).json({ success: true, categories: FALLBACK_CATEGORIES });
  } catch (error) {
    console.warn('getCategories fallback activated:', error.message);
    return res.status(200).json({ success: true, categories: FALLBACK_CATEGORIES });
  }
};

export const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const category = await Category.create({
      name: name.trim(),
      description,
      image,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.status(200).json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
