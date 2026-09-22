import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!form.email.includes('@')) newErrors.email = 'Invalid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
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
      await registerUser(form);
      alert('Registered successfully! Please login.');
      navigate('/login');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="form-box">
        <h2>Create Account</h2>
        <p className="subtitle">Register to start adding products</p>
        {serverError && <p className="error-box">{serverError}</p>}

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p className="error">{errors.name}</p>}

          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}

          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
          {errors.password && <p className="error">{errors.password}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : 'Register'}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
