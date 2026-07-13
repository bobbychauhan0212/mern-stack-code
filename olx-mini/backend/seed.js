require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Listing = require('./models/Listing');

const products = [
  {
    title: "TVS Scooty Zest",
    description: "Well maintained TVS Scooty in excellent condition.",
    price: 32000,
    category: "Vehicles",
    location: "Delhi",
    imageUrl: "/uploads/tvs-zest.jpg"
  },

  {
    title: "Hyundai i20 Sportz 2017",
    description: "Single owner, excellent condition with all documents.",
    price: 420000,
    category: "Vehicles",
    location: "Ludhiana, Punjab",
    imageUrl: "/uploads/hyundai-i20.jpg"
  },

  {
    title: "Camera Tripod Stand",
    description: "Professional tripod for DSLR and mobile photography.",
    price: 1200,
    category: "Electronics",
    location: "Mohali, Punjab",
    imageUrl: "/uploads/tripod.jpg"
  }
];

const categoryColors = {
  Electronics: '3B82F6',
  Furniture: 'A0522D',
  Vehicles: 'DC2626',
  Fashion: 'DB2777',
  Books: '16A34A',
  Other: '6B7280'
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    let demoSeller = await User.findOne({ email: 'demoseller@olxmini.com' });

    if (!demoSeller) {
      const hashedPassword = await bcrypt.hash('demo1234', 10);
      demoSeller = await User.create({
        name: 'Demo Seller',
        email: 'demoseller@olxmini.com',
        password: hashedPassword,
        phone: '9999999999'
      });
      console.log('Demo seller account created');
    } else {
      console.log('Using existing demo seller account');
    }

    const deleted = await Listing.deleteMany({ seller: demoSeller._id });
    console.log(`Removed ${deleted.deletedCount} old demo listings`);

    const listingsToInsert = products.map((product) => ({
  title: product.title,
  description: product.description,
  price: product.price,
  category: product.category,
  location: product.location,
  imageUrl: product.imageUrl,
  seller: demoSeller._id
}));

    await Listing.insertMany(listingsToInsert);
    console.log(`${listingsToInsert.length} products added successfully!`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();