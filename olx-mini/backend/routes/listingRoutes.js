const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing
} = require('../controllers/listingController');

router.get('/', getListings);
router.get('/user/mine', protect, getMyListings);
router.get('/:id', getListingById);
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;