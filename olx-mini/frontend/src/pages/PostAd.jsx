import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PostAd = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    location: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const categories = ['Electronics', 'Furniture', 'Vehicles', 'Fashion', 'Books', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to post an ad');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';

      if (imageFile) {
        const imageForm = new FormData();
        imageForm.append('image', imageFile);

        const uploadRes = await API.post('/upload', imageForm, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.imageUrl;
      }

      await API.post('/listings', {
        ...formData,
        price: Number(formData.price),
        imageUrl
      });

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="auth-form-container">
        <p>You must be logged in to post an ad.</p>
      </div>
    );
  }

  return (
    <div className="auth-form-container" style={{ maxWidth: '500px' }}>
      <h1>Post an Ad</h1>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Photo (optional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
          {loading ? 'Posting...' : 'Post Ad'}
        </button>
      </form>
    </div>
  );
};

export default PostAd;