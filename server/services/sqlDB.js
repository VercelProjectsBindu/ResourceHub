const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fintech_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const sqlDB = {
  query: async (sql, params) => {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('Database Query Error:', error);
      throw error;
    }
  },
  
  getConnection: async () => {
    return await pool.getConnection();
  }
};

module.exports = sqlDB;
