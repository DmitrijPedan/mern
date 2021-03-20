const {Router} = require("express");
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const {check, validationResult} = require("express-validator");
const User = require('../models/User');
const router = Router();

const urlencodedParser = bodyParser.urlencoded({ extended: false })

// /api/auth/register
router.post(
    '/register',
    urlencodedParser,
    [
        check('email', 'incorrect email').isEmail(),
        check('password', 'incorrect password (min 6 symbols)').isLength({min: 6}),
    ],
    async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'incorrect register data', errors: errors});
        }

        //request data
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;

        const candidate = await User.findOne({email: email});

        // if user exists
        if (candidate) {
           return res.status(400).json({message: 'such user already exists'})
        }

        // create user
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            email: email,
            password: hashedPassword,
            name: name || '',
        });

        //save user
        await user.save();

        res.status(201).json({ message: 'user created' })


    } catch (e) {
        res.status(500).json({
            message: 'something went wrong',
            error: e
        })
    }
})

// /api/auth/login
router.post(
    '/login',
    urlencodedParser,
    [
      check('email', 'Please input correct email').normalizeEmail().isEmail(),
      check('password', 'Please input correct password').exists(),
    ],
    async(req, res) => {
        try {

            //validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'incorrect login data', errors: errors});
            }

            // request data
            const email = req.body.email;
            const password = req.body.password;

            const user = await User.findOne({email: email});

            //if user not find
            if (!user) {
                return res.status(400).json({message: 'user not found'})
            }

            //match passwords
            const passIsMatch = await bcrypt.compare(password, user.password);
            if (!passIsMatch) {
                return res.status(400).json({message: 'wrong password'})
            }

            //authorization
            const token = jwt.sign(
                {userId: user.id, userEmail: user.email},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            );

            res.json({message: 'welcome to system', token: token, userId: user.id}) // default status 200

        } catch (e) {
            res.status(500).json({
                message: 'something went wrong',
                error: e
            })
        }
})

module.exports = router;