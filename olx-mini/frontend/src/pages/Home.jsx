import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { user, logout } = useAuth();

  const categories = ['Electronics', 'Furniture', 'Vehicles', 'Fashion', 'Books', 'Other'];

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const res = await API.get('/listings', { params });
      setListings(res.data);
    } catch (err) {
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">OLX Mini</Link>
        <div className="navbar-links">
          {user ? (
            <>
              <span>Hi, {user.name}</span>
              <Link to="/post-ad">Post an Ad</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <div className="page-container">
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary">Search</button>
        </form>

        {loading && <p className="empty-state">Loading listings...</p>}
        {error && <p className="form-error">{error}</p>}
        {!loading && !error && listings.length === 0 && (
          <p className="empty-state">No listings found.</p>
        )}

        <div className="listing-grid">
          {listings.map((listing) => (
            <Link key={listing._id} to={`/listing/${listing._id}`} className="listing-card">
              <img
                className="listing-card-image"
                src={
                  listing.imageUrl
                    ? listing.imageUrl.startsWith('http')
                      ? listing.imageUrl
                      : `http://localhost:5000${listing.imageUrl}`
                    : 'https://placehold.co/300x200?text=No+Image'
                }
                alt={listing.title}
              />
              <div className="listing-card-body">
                <p className="listing-card-title">{listing.title}</p>
                <p className="listing-card-price">₹{listing.price}</p>
                <p className="listing-card-location">{listing.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;