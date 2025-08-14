const db = require('../db');

async function addNewUser(new_user) {
    const [existingEmail] = await db.query(
        'SELECT id FROM users WHERE email = ?',
        [new_user.email]
    );

    if (existingEmail.length > 0) {
        throw { status: 409, message: 'Email already taken' };
    }

    const [existingUsername] = await db.query(
        'SELECT id FROM users WHERE username = ?',
        [new_user.username]
    );
    
    if (existingUsername.length > 0) {
        throw { status: 409, message: 'Username already taken' };
    }


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