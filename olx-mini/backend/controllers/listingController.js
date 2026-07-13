const Listing = require('../models/Listing');

// @route POST /api/listings
const createListing = async (req, res) => {
  try {
    const { title, description, price, category, location, imageUrl } = req.body;

    if (!title || !description || !price || !category || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const listing = await Listing.create({
      title,
      description,
      price,
      category,
      location,
      imageUrl,
      seller: req.userId
    });

    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route GET /api/listings
const getListings = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    const filter = { status: 'available' };

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(filter)
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route GET /api/listings/:id
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name email phone');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route GET /api/listings/user/mine
const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route PUT /api/listings/:id
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.seller.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this listing' });
    }

    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route DELETE /api/listings/:id
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.seller.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await listing.deleteOne();
    res.status(200).json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing
};