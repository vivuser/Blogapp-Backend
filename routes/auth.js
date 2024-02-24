const fs = require('fs');
const express = require('express');
const router = express.Router() 
const model = require('../models/user')
const mongoose = require('mongoose')
const passport = require('passport');
const User = model.User
var jwt = require('jsonwebtoken');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const privateKey = fs.readFileSync(path.resolve(__dirname, '../private.key'), 'utf-8')
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

function createUserId() {
    const dataUser = Date.now()
    const useId = Math.floor(Math.random() * 1000)
    return dataUser + useId
}

router.use(session({ secret: 'dsghsagjdhsa', resave: true, saveUninitialized: true }));
router.use(passport.initialize());

passport.use(
    new GitHubStrategy(
        {
            clientID: '6c04c95bbd0476ebef03' ,
            clientSecret: 'f98886444aad042ec71d97d6b146d59f7a6d54dc',
            callbackURL: 'http://localhost:3000/auth/github/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            const gitHubUser = await User.findOne({ gitHubId: profile.id });
            if (gitHubUser) {
                return done(null, gitHubUser);
            } else{
                const newUser = new User({ 
                    name: profile.displayName,
                    gitHubId: profile.id
                });
                const savedUser = await newUser.save()
                return done(null, savedUser);
            }
        }
    )
)

// passport.use(
//     new GoogleStrategy(
//         {
//             clientId: 'x',
//             clientSecret: 'x',
//             callbackURL: 'x',
//         },
//         async (token, tokenSecret, profile, done) => {
//             const googleUser = await User.findOne({ googleId: profile.id });
//             if (googleUser) {
//                 return done(null, googleUser);
//             } else {
//                 const newUser = new User({
//                     name: profile.displayName,
//                     googleId: profile.id,
//                 });
//                 const savedUser = await newUser.save();
//                 return done(null, savedUser);
//             }
//         }
//     )
// )

router.get('/github', passport.authenticate('github'));


router.post('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req,res) => {
    try {
        res.redirect('/')
    } catch (err) {
        console.error('Error in GitHub callback:', err);
        res.status(500).json({ error: 'An error occurred during GitHub authentication.' });
    }
});

// router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req,res) => {
//     res.redirect('/')
// })


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