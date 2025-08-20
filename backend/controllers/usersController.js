const usersModel = require('../models/usersModel');
const jwt = require("jsonwebtoken");

require('dotenv').config();


async function addNewUser(req, res) {
    try {
        const { email, username, password, first_name, last_name, university } = req.body;
        
        const new_user = await usersModel.addNewUser({
            email,
            username,
            password,
            first_name,
            last_name,
            university
        });    

        res.status(201).json(new_user);

    } catch (err) {
        console.error('Error signing up user: ', err);
        if (err.status) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: 'Database error' });
        }
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        
        const user_info = await usersModel.loginUser({email,password});
        const token = jwt.sign({ id: user_info.id, email: user_info.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        res.status(201).json({'user': user_info, 'token': token});

    } catch (err) {
        console.error('Error signing in user: ', err);
        if (err.status) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: 'Database error' });
        }
    }
}



async function getAllUsers(req, res) {
    try {
        const users = await usersModel.getAllUsers();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error getAllUsers' });
    }
}

async function getUserByUsername(req, res) {
    try {
        const username = req.params.username;
        const  cur_user = await usersModel.getUserByUsername(username);
        res.json(cur_user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error getUserByUserName' });
    }
}

async function updateProfileHandler(req, res) {
    try {

        const user_id = req.user.id;
        const { first_name, last_name, university } = req.body;

        const users = await usersModel.updateProfile(user_id, first_name, last_name, university);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error getAllUsers' });
    }
}

module.exports = {
    addNewUser,
    loginUser,
    getAllUsers,
    getUserByUsername,
    updateProfileHandler,
};