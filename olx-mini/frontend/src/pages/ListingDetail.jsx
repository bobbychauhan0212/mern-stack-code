import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.get(`/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Listing not found');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await API.delete(`/listings/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  if (loading) return <p className="empty-state">Loading...</p>;
  if (error) return <p className="empty-state" style={{ color: 'var(--danger)' }}>{error}</p>;
  if (!listing) return null;

  const isOwner = user && listing.seller?._id === user.id;

  return (
    <div className="detail-container">
      <Link to="/" className="back-link">&larr; Back to listings</Link>

      {listing.imageUrl && (
        <img
          className="detail-image"
          src={listing.imageUrl.startsWith('http') ? listing.imageUrl : `http://localhost:5000${listing.imageUrl}`}
          alt={listing.title}
        />
      )}

      <h1 className="detail-title">{listing.title}</h1>
      <p className="detail-price">₹{listing.price}</p>
      <p className="detail-meta">{listing.location}</p>
      <p className="detail-meta">Category: {listing.category}</p>

      <h3>Description</h3>
      <p>{listing.description}</p>

      <div className="seller-box">
        <h3 style={{ marginTop: 0 }}>Seller</h3>
        <p>{listing.seller?.name}</p>

        {!showContact ? (
          <button onClick={() => setShowContact(true)} className="btn-secondary">
            Show Contact Info
          </button>
        ) : (
          <div>
            <p>Email: {listing.seller?.email}</p>
            {listing.seller?.phone && <p>Phone: {listing.seller.phone}</p>}
          </div>
        )}
      </div>

      {isOwner && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleDelete} className="btn-danger">
            Delete Listing
          </button>
        </div>
      )}
    </div>
  );
};

export default ListingDetail;