import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { IMAGE_URL } from '../../api/axios';

function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res.data))
      .catch((error) => setError(error.response?.data?.message || 'Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error-box">{error}</p>;

  return (
    <div className="form-box">
      {product.image && <img src={IMAGE_URL + product.image} alt={product.name} className="product-img" />}
      <h2>{product.name}</h2>
      <p className="price">₹{product.price}</p>

      <div className="details">
        <p><span>Description</span> {product.description || 'No description'}</p>
        <p><span>Quantity</span> {product.quantity}</p>
        <p><span>Created</span> {new Date(product.created_at).toLocaleDateString()}</p>
      </div>

      <div className="actions">
        <Link to={'/products/edit/' + id} className="btn">Edit</Link>
        <Link to="/products" className="btn secondary">Back</Link>
      </div>
    </div>
  );
}

export default ProductView;
