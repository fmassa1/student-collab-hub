const db = require('../db');

async function addNewUser(new_user) {
    const [result] = await db.query(
      `INSERT INTO users (email, username, password, first_name, last_name, university)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [new_user.email, new_user.username, new_user.password, new_user.first_name, new_user.last_name, new_user.university]
    );
  
  
    return { id: result.insertId, ...new_user };
}

async function getAllUsers() {
  const [rows] = await db.query(`
    SELECT *
    FROM users
  `);
  return rows;
}

async function getUserById(id) {
  const [rows] = await db.query(`
    SELECT *
    FROM users
    WHERE id = ?
  `, [id]
  );
  return rows;
}


module.exports = {
    addNewUser,
    getAllUsers,
    getUserById,
  };