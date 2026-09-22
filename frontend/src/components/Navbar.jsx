import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  useLocation(); // re-render navbar when page changes

  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  function logout() {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/products" className="logo">🛒 Product App</Link>
      {token ? (
        <div className="nav-links">
          <Link to="/products">Products</Link>
          <Link to="/products/add">Add Product</Link>
          <span>Hi, {name}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      ) : (
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
