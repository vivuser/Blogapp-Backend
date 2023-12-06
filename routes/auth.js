const jwt = require('jsonwebtoken');
const model = require('../model/user')
const user = model.User
const bcrypt = require('bcrypt')

exports.createUser = (req,res) => {
    const user = newUser({...req.body});
    
}