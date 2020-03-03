const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

router.post('/user', async (req, res, next) => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    let user = {};
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = hashedPassword;
    User.create(user)
        .then(post => {
            res.json({
                confirmation: "success",
                data: post
            });
        })
        .catch(err => {
            res.json({
                confirmation: "fail",
                message: err.message
            });
        });

});

module.exports = router;