import { Navigate } from 'react-router-dom';

// only logged in users can open these pages
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
