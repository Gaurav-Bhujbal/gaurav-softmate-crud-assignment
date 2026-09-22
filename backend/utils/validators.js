function validateRegister(body) {
  const { name, email, password } = body;
  if (!name || !email || !password) return 'All fields are required';
  if (!email.includes('@')) return 'Invalid email';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

function validateLogin(body) {
  const { email, password } = body;
  if (!email || !password) return 'Email and password are required';
  return null;
}

function validateProduct(body) {
  const { name, price, quantity } = body;
  if (!name) return 'Name is required';
  if (price === undefined || price === '' || isNaN(price) || Number(price) < 0) {
    return 'Price must be a positive number';
  }
  if (quantity === undefined || quantity === '' || !Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
    return 'Quantity must be a positive whole number';
  }
  return null;
}

module.exports = { validateRegister, validateLogin, validateProduct };
