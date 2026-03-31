const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor(sqlDB) {
    this.db = sqlDB;
    this.secret = process.env.JWT_SECRET || 'secret';
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(password, hashed) {
    return await bcrypt.compare(password, hashed);
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      this.secret,
      { expiresIn: process.env.JWT_EXPIRES || '24h' }
    );
  }

  async findByEmail(email) {
    return new Promise((resolve, reject) => {
      this.db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  }

  async register({ username, email, password, role = 'user' }) {
    // Basic Validation
    if (!username || !email || !password) {
      throw new Error('All fields are required');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Check for duplicates
    const existingUser = await this.findByUsername(username);
    if (existingUser) throw new Error('Username already exists');

    const existingEmail = await this.findByEmail(email);
    if (existingEmail) throw new Error('Email already registered');

    const hashedPassword = await this.hashPassword(password);
    return new Promise((resolve, reject) => {
      this.db.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, role],
        (err, results) => {
          if (err) return reject(err);
          resolve({ id: results.insertId, username, email, role });
        }
      );
    });
  }

  async findByUsername(username) {
    return new Promise((resolve, reject) => {
      this.db.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  }

  async login(username, password) {
    const user = await this.findByUsername(username);
    if (!user) throw new Error('User not found');

    const isMatch = await this.comparePassword(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = this.generateToken(user);
    return { token, user: { id: user.id, username: user.username, role: user.role } };
  }
}

module.exports = AuthService;
