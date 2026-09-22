import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';
import ProductView from './pages/products/ProductView';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/products" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
          <Route path="/products/add" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
          <Route path="/products/edit/:id" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
          <Route path="/products/:id" element={<PrivateRoute><ProductView /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
