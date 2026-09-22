const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { validateRegister, validateLogin } = require('../utils/validators');

// POST /api/auth/register
async function register(req, res) {
  const error = validateRegister(req.body);
  if (error) return res.status(400).json({ message: error });

  const { name, email, password } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  const error = validateLogin(req.body);
  if (error) return res.status(400).json({ message: error });

  const { email, password } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login };
