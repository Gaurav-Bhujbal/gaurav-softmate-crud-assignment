const db = require('../config/db');
const { validateProduct } = require('../utils/validators');

// GET /api/products?page=1&search=
async function getProducts(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  try {
    const [products] = await db.query(
      'SELECT * FROM products WHERE name LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?',
      ['%' + search + '%', limit, offset]
    );
    const [count] = await db.query('SELECT COUNT(*) AS total FROM products WHERE name LIKE ?', [
      '%' + search + '%',
    ]);

    const total = count[0].total;
    res.json({ products, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/products/:id
async function getProductById(req, res) {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(products[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/products
async function createProduct(req, res) {
  const error = validateProduct(req.body);
  if (error) return res.status(400).json({ message: error });

  const { name, description, price, quantity } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const [result] = await db.query(
      'INSERT INTO products (name, description, price, quantity, image, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, quantity, image, req.user.id]
    );
    res.status(201).json({ message: 'Product created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

// PUT /api/products/:id
async function updateProduct(req, res) {
  const error = validateProduct(req.body);
  if (error) return res.status(400).json({ message: error });

  const { name, description, price, quantity } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    // IFNULL keeps the old image if no new image was uploaded
    const [result] = await db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, image = IFNULL(?, image) WHERE id = ?',
      [name, description, price, quantity, image, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

// DELETE /api/products/:id
async function deleteProduct(req, res) {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
