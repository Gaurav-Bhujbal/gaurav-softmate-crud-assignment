import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!form.email.includes('@')) newErrors.email = 'Invalid email';
    if (!form.password) newErrors.password = 'Password is required';
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setServerError('');
    try {
      const res = await loginUser(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.user.name);
      navigate('/products');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="form-box">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to manage your products</p>
        {serverError && <p className="error-box">{serverError}</p>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}

          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
          {errors.password && <p className="error">{errors.password}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
