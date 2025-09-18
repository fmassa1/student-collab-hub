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

async function updateProfilePicture(imageUrl, userId) {

    const [rows] = await db.query(`
        UPDATE users
        SET profile_picture_url = ?
        WHERE id = ?
      `, [imageUrl, userId]);
    return rows;
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
        SELECT users.id, 
            users.email, 
            users.username,
            users.first_name, 
            users.last_name, 
            users.university,
            users.bio,
            users.linkedin_url,
            users.github_url,
            users.profile_picture_url
        FROM users
        WHERE username = ?
    `, [username]
    );
    return rows;
}

async function getUserByID(id) {
    const [rows] = await db.query(`
      SELECT users.id, 
            users.email, 
            users.username, 
            users.first_name, 
            users.last_name, 
            users.university,
            users.bio,
            users.linkedin_url,
            users.github_url
      FROM users
      WHERE id = ?
    `, [id]
    );
    return rows;
  }

async function updateProfile(id, first_name, last_name, school, bio, linkedin_url, github_url) {
    const [updated] = await db.query(`
        UPDATE users
        SET first_name = ?, 
            last_name = ?, 
            university = ?,
            bio = ?, 
            linkedin_url = ?, 
            github_url = ?
        WHERE id = ?
    `, [first_name, last_name, school, bio, linkedin_url, github_url, id]
    );
    user = await getUserByID(id);
    return user[0];
}

async function getUserNotifications(user_id) {
    const [notifications] = await db.query(`
        SELECT n.*, u.username AS from_username, p.name AS project_title
        FROM notifications n
        JOIN users u ON n.from_user_id = u.id
        JOIN projects p ON n.project_id = p.id
        WHERE n.user_id = ? AND n.seen = false
        ORDER BY n.date_created DESC
    `, [user_id]);

    return notifications.map(n => {
        let message;
        switch (n.type) {
            case "comment like":
                message = `${n.from_username} liked you comment on "${n.project_title}"`;
                break;
            case "comment":
                message = `${n.from_username} commented on your project "${n.project_title}"`;
                break;
            case "project like":
                message = `${n.from_username} liked your project "${n.project_title}"`;
                break;
            default:
                message = `New activity on "${n.project_title}"`;
        }

        return {
            id: n.id,
            message,
            type: n.type,
            seen: n.seen,
            project_id: n.project_id,
            date_created: n.date_created,
            raw: n
        };
    });
}

async function markUserNotificationRead(notifications_id) {
    const [updated] = await db.query(`
        UPDATE notifications 
        SET seen = TRUE
        WHERE id = ? 
    `, [notifications_id]
    );
    return updated;
}


module.exports = {
    addNewUser,
    loginUser,
    getAllUsers,
    getUserByUsername,
    getUserByID,
    updateProfile,
    getUserNotifications,
    markUserNotificationRead,
    updateProfilePicture
  };