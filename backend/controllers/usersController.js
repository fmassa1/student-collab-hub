const usersModel = require('../models/usersModel');

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
        res.status(500).json({ error: 'Database error' });
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

async function getUserById(req, res) {
    try {
        const id = req.params.id;
        const  cur_user = await usersModel.getUserById(id);
        res.json(cur_user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error getUserById' });
    }
}



module.exports = {
    addNewUser,
    getAllUsers,
    getUserById,
};