import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, createProduct, updateProduct } from '../../services/productService';
import { IMAGE_URL } from '../../api/axios';

// same form is used for Add and Edit
function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', description: '', price: '', quantity: '' });
  const [image, setImage] = useState(null); // new file selected by user
  const [preview, setPreview] = useState(''); // image shown in the form
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // in edit mode, load the product first
  useEffect(() => {
    if (isEdit) {
      getProductById(id)
        .then((res) => {
          setForm({
            name: res.data.name,
            description: res.data.description || '',
            price: res.data.price,
            quantity: res.data.quantity,
          });
          if (res.data.image) setPreview(IMAGE_URL + res.data.image);
        })
        .catch(() => setServerError('Failed to load product'));
    }
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function validate() {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (form.price === '') newErrors.price = 'Price is required';
    else if (Number(form.price) < 0) newErrors.price = 'Price cannot be negative';
    if (form.quantity === '') newErrors.quantity = 'Quantity is required';
    else if (Number(form.quantity) < 0) newErrors.quantity = 'Quantity cannot be negative';
    if (image && !image.type.startsWith('image/')) newErrors.image = 'Only image files are allowed';
    else if (image && image.size > 2 * 1024 * 1024) newErrors.image = 'Image must be less than 2MB';
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // FormData is needed to send a file
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('quantity', form.quantity);
    if (image) formData.append('image', image);

    setLoading(true);
    setServerError('');
    try {
      if (isEdit) {
        await updateProduct(id, formData);
      } else {
        await createProduct(formData);
      }
      navigate('/products');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-box">
      <h2>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
      {serverError && <p className="error-box">{serverError}</p>}

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <p className="error">{errors.name}</p>}

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} />

        <label>Price</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} />
        {errors.price && <p className="error">{errors.price}</p>}

        <label>Quantity</label>
        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} />
        {errors.quantity && <p className="error">{errors.quantity}</p>}

        <label>Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {errors.image && <p className="error">{errors.image}</p>}
        {preview && <img src={preview} alt="Preview" className="preview-img" />}

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
