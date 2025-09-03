const db = require('../db');
const argon2 = require('argon2');


async function addNewUser(new_user) {
    try {
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

        const password_hash = await argon2.hash(new_user.password);

        const [result] = await db.query(
        `INSERT INTO users (email, username, password, first_name, last_name, university)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [new_user.email, new_user.username, password_hash, new_user.first_name, new_user.last_name, new_user.university]
        );
    
    
        return { id: result.insertId, ...new_user };
    } 
    catch(error) {
        console.error("Error hashing password:", error);
        throw error;
    }
}

async function loginUser(user_info) {
    try {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ? ',
            [user_info.email]
        );

        if (rows.length === 0) {
            throw { status: 401, message: 'Email not found' };
        }

        const user = rows[0];

        if (await argon2.verify(user.password, user_info.password)) {
            delete user.password;
            const [update_last_login] = await db.query(
                `UPDATE users SET last_logged_in = NOW() WHERE id = ?;`, 
                [user.id]
            );
            return user;
        } 

        throw { status: 401, message: 'Incorrect Password' };

    } 
    catch(error) {
        console.error("Error hashing password:", error);
        throw error;

    }
}

async function getAllUsers() {
  const [rows] = await db.query(`
    SELECT id, email, username, first_name, last_name, university
    FROM users
  `);
  return rows;
}

async function getUserByUsername(username) {
  const [rows] = await db.query(`
    SELECT users.id, users.email, users.username, users.first_name, users.last_name, users.university         
    FROM users
    WHERE username = ?
  `, [username]
  );
  return rows;
}

async function updateProfile(id, first_name, last_name, school) {
    const [updated] = await db.query(`
        UPDATE users
        SET first_name = ?, last_name = ?, university = ?
        WHERE id = ?
    `, [first_name, last_name, school, id]
    );

    const [rows] = await db.query(`
        SELECT id, email, username, first_name, last_name, university
        FROM users
        WHERE id = ?
    `, [id]
    );

    return rows[0];
}


module.exports = {
    addNewUser,
    loginUser,
    getAllUsers,
    getUserByUsername,
    updateProfile
  };