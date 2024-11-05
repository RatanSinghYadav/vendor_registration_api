const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/user.model.js');

const userSignup = async (req, res) => {
    const { userName, email, phone, password, cPassword, role } = req.body;


    // Initial input validation
    if (!userName || !email || !password || !cPassword) {
        return res.status(422).json({ success: false, message: "Missing required fields" });
    }

    // Additional validation for confirm password
    if (password !== cPassword) {
        return res.status(422).json({ success: false, message: "Passwords do not match" });
    }

    try {
        // Validate inputs
        await Promise.all([
            body('userName').notEmpty(),
            body('email').isEmail(),
            body('phone').isNumeric().isLength({ min: 10, max: 10 }),
            body('password').isLength({ min: 3 }),
            body('cPassword').isLength({ min: 3 })
        ]);

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ success: false, errors: errors.array() });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(422).json({ success: false, message: "User already exists" });
        }

        // Hash password
        const saltRounds = 4;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const user = new User({
            userName: userName,
            email: email,
            phone: phone,
            password: hashedPassword,
            role: role
        });

        const newUser = await user.save();

        // Generate token for authentication
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '6h' });

        res.status(201).json({ success: true, message: "User created successfully", newUser, token });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: "Registration failed!" });
    }
};
  

const userLogin = async (req, res) => {
    const { email, password, role } = req.body;

    // console.log(email, password, role)
    try {
        // Validation
        if (!email || !password || !role) {
            return res.status(422).json({ success: false, message: "Something is missing in email/password" });

        }

        const userlogin = await User.findOne({ email: email });

        if (userlogin.role !== role) {
            res.status(401).json({ success: false, message: "user role does not match with existing user!" });
            return
        }

        // console.log(userlogin.role);

        if (!userlogin) {
            return res.status(401).json({ message: 'You are not registered. Please register first.' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, userlogin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed' });
        }


        // Return token for future authentication
        const token = jwt.sign({ userId: userlogin._id, role: userlogin.role }, process.env.JWT_SECRET);

        res.cookie("user_data", token, {
            expires: new Date(Date.now() + 900000),
            httpOnly: true
        })

        res.status(200).json({ success: true, message: 'User successfully logged in', userlogin, token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: "Login failed!" });

    }


}

module.exports = { userSignup, userLogin };