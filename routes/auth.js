const jwt = require('jsonwebtoken');
const model = require('../models/user')
const User = model.User
const bcrypt = require('bcrypt')

exports.createUser = (req,res) => {
    const newUser = new User({...req.body});
    var token = jwt.sign({ email: req.body.email}, privateKey, {algorithm: 'RS256'});
    const hash = bcrypt.hashSync(req.body.password, 10);
    newUser.token = token;
    newUser.password = hash
    return newUser.save()
        .then(savedUser => {
            console.log('Saved User', savedUser);
            res.status(201).json({token})
        })
        .catch(error => {
            console.error('Error', error);
            res.status(500).json({ error: 'An error while saving the user.'});
        });
};