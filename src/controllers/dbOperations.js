const { pool } = require("../../config/dbConfig");

async function getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }
  
  async function createUser(name, email, hashedPassword, photoFilename) {
    const query = 'INSERT INTO users (name, email, password, photo) VALUES ($1, $2, $3, $4) RETURNING id, password';
    const result = await pool.query(query, [name, email, hashedPassword, photoFilename]);
    return result.rows[0];
  }
  
  // Exportar las funciones
  module.exports = {
    getUserByEmail,
    createUser,
  };
  