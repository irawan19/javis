const pool = require('./db');
const bcrypt = require('bcrypt');

(async () => {
  const email = 'admin@example.com';
  const username = 'admin';
  const password = '123456';
  const hash = await bcrypt.hash(password, 10);

  const conn = await pool.getConnection();
  try {
    await conn.query(`CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      username VARCHAR(100) UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await conn.query('INSERT INTO users (email, username, password) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)', [email, username, hash]);
    console.log('User admin created: admin / 123456');
  } catch (e) {
    console.error(e);
  } finally {
    conn.release();
    process.exit(0);
  }
})();
