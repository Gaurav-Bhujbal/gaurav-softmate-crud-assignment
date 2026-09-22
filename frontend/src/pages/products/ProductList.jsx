import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/productService';
import { IMAGE_URL } from '../../api/axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadProducts() {
    setLoading(true);
    setError('');
    try {
      const res = await getProducts(page, search);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (error) {
      alert('Failed to delete product');
    }
  }

  return (
    <div>
      <div className="header">
        <h2>Products</h2>
        <Link to="/products/add" className="btn">+ Add Product</Link>
      </div>

      <input
        className="search"
        placeholder="🔍 Search by name..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error-box">{error}</p>}
      {!loading && !error && products.length === 0 && <p className="loading">No products found.</p>}

      {!loading && products.length > 0 && (
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.image ? (
                      <img src={IMAGE_URL + product.image} alt={product.name} className="thumb" />
                    ) : (
                      <span className="no-img">No image</span>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>
                    <span className={product.quantity < 5 ? 'badge low' : 'badge'}>
                      {product.quantity}
                    </span>
                  </td>
                  <td>
                    <Link to={'/products/' + product.id} className="link-btn view">View</Link>
                    <Link to={'/products/edit/' + product.id} className="link-btn edit">Edit</Link>
                    <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default ProductList;
