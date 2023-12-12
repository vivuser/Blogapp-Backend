const fs = require('fs');
const express = require('express');
const router = express.Router() 
const model = require('../models/user')
const mongoose = require('mongoose')
const User = model.User
var jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcrypt');
const privateKey = fs.readFileSync(path.resolve(__dirname, '../private.key'), 'utf-8')

function createUserId() {
    const dataUser = Date.now()
    const useId = Math.floor(Math.random() * 1000)
    return dataUser + useId
}

router.post('/signup', async (req,res) => { 
try  {
    const userId = createUserId();
    const { name, email, password, confirmPassword } = req.body;

    const user = new User({...req.body, userId})
    var token = jwt.sign( { email:req.body.email }, privateKey, { algorithm : 'RS256' });
    const hash = bcrypt.hashSync(req.body.password, 10  );
    user.token = token;
    user.password = hash
    const savedUser = await user.save();

    console.log('Saved User', savedUser);
    res.status(201).json({ message: 'User saved successfully', token: token });
}
        catch(error){
            console.error('Error', error);
            res.status(500).json({ error: 'An error while saving the user.'});
        };


})

router.post('/login', async (req, res) => {
    try {
        const doc = await User.findOne({ email:req.body.email })
        const isAuth = bcrypt.compareSync(req.body.password, doc.password);
        if (isAuth) {
            var token = jwt.sign({ email: req.body.email}, privateKey, { algorithm: 'RS256' });
            doc.token = token;
            doc.save()
            res.json({ name: doc.name, email:req.body.email, token, userId: doc.userId})
        } else{
            res.sendStatus(401)
        }
    }
        catch(err) {
            res.status(401).json(err)
        }
    }
)

module.exports = router;