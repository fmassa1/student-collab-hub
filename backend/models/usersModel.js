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

async function loginUser(user_info) {
    const [rows] = await db.query(
        'SELECT id, email, username, first_name, last_name, university FROM users WHERE email = ? AND password = ?',
        [user_info.email, user_info.password]
    );

    if (rows.length === 0) {
        throw { status: 401, message: 'Email or password is incorrect' };
    }

    return rows[0];
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
    loginUser,
    getAllUsers,
    getUserById,
  };