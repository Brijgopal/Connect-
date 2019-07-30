const bcrypt = require('bcryptjs'),
    express = require('express'),
    jwt = require('jsonwebtoken'),
    passport = require('passport'),
    { secretOrKey } = require('../config/keys'),
    { User } = require('../models');
//==========================================================================
const router = express.Router();
const validateRegisterInput = require('../validation/signup');
const validateLoginInput = require('../validation/login');
//==========================================================================
//@route    POST: api/users/signup
//@desc     Sign-Up Functionality
//@access   Public

router.post('/signup', validateRegisterInput, async (req, res) => {
    let { name, email, password, gender, role } = req.body;
    const user = await User.findOne({ email, role });
    if (user)
        return res.status(400).json({ email: 'Email already registered!' });

    let newUser = new User({ name, email, gender, role });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser = await newUser.save();
            res.json(newUser);
        });
    });
});
//==========================================================================
//@route    POST: api/users/login
//@desc     Login user and generate token
//@access   Public

router.post('/login', validateLoginInput, async (req, res) => {
    const { email, role, password } = req.body;
    const user = await User.findOne({ email, role });
    if (!user) return res.status(404).json({ email: 'User not found!' });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched)
        return res.status(400).json({ password: 'password incorrect!' });

    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role,
        profilePic: user.profilePic,
    };
    jwt.sign(payload, secretOrKey, { expiresIn: 3600 }, (err, token) => {
        res.json({
            success: true,
            token: 'Bearer ' + token,
        });
    });
});
//==========================================================================
//@route    POST: api/users/current
//@desc     Return Current user
//@access   Private

router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json(req.user);
    },
);
// ============================================================================
//@route    POST: /api/users/
//@desc     
//@access   

//==========================================================================
module.exports = router;
