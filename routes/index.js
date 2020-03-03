const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');

const User = require('../models/User');

const redirectLogin = require('../app');

const sessVars = require('../config/keys');

router.get('/', function (req, res, next) {
    const {usedID} = req.session;
    res.render('generic', {
        title: 'Welcome'
    });
});

router.get('/login', (req, res, next) => {
    res.render('login', {
        title: 'Login'
    });
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({
        "username": req.body.username
    }).exec();
    if (!user) {
        return res.status(400).send('Cannot find user...');
    } else {
        try {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                req.session.userID = user.id;
                req.session.username = user.username;
                return res.redirect('/index');
            } else {
                res.send('Not allowed');
            }
        } catch {
            res.status(500).send();
        }
    }
    res.redirect('/login');
});

router.get('/index', redirectLogin, (req, res, next) => {
    res.render('index', {
        title: 'Chat',
        username: req.session.username
    });
});

router.get('/registration', (req, res, next) => {
    res.render('registration', {
        title: 'Registration'
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            return res.redirect('/');
        }
        res.clearCookie(sessVars.SESS_NAME);
        res.redirect('/');
    })
});

module.exports = router;