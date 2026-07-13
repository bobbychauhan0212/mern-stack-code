import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostAd from './pages/PostAd';
import ListingDetail from './pages/ListingDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/post-ad" element={<PostAd />} />
      <Route path="/listing/:id" element={<ListingDetail />} />
    </Routes>
  );
}

export default App;