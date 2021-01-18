const router = require('express').Router();
const User = require('../model/User');
const Employee = require('../model/Employee');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');


// @route POST api/posts/register
// @description register a user by sending required data in request body
// @access Public
router.post('/register', async (req, res) => {

    // Validate the data before we create a User/Employee
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    // Hash passwords before storing them
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword
    });

    // Create a new employee
    const employee = new Employee({
        organisation_name: req.body.organisation_name,
        user: user._id
    });

    try {
        const savedEmployee = await employee.save();
        const savedUser = await user.save();
        res.send({ user: user._id, employee: employee._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

// @route POST api/posts/login
// @description Login
// @access Public
router.post('/login', async (req, res) => {

    // LETS VALIDATE THE DATA 
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email address');

    // If password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    // Cretae and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('jwt-token', token).send(`Bearer ${token}`);
});

module.exports = router;