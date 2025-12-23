import jwt from 'jsonwebtoken';
import { User } from '../model/user.model.js';

//* Generates a JSON Web Token (JWT) for a given user ID.
const generatetoken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

//* @desc     register new user
//* @route    POST/api/users
//* @access   PUBLIC

export const registerUser = async (req, res) => {
    const { email, name, password } = req.body;

    try {
        // Check if a user with the given email already exists in the database.
        const userExists = await User.findOne({ email });

        if (userExists) {
            // If the user exists, return a 400 Bad Request status.
            return res.status(400).json({
                message: 'user already exists',
            });
        }

        // Create a new user with the provided details.
        const user = await User.create({
            email,
            name,
            password,
        });

        // If user creation is successful, respond with user data and a JWT.
        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generatetoken(user._id), // Generate and include the token.
            });
        } else {
            // This case is unlikely if validation is correct, but handles other creation failures.
            res.status(400).json({ message: 'Invalid user Input' });
        }
    } catch (err) {
        // Handle potential errors during the process, like database errors.
        res.status(500).json({ message: err.message });
    }
};

//* @desc     Authenticate a user and get a token (login)
//* @route    POST /api/users/login
//* @access   Public
export const loginuser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by their email address.
        const user = await User.findOne({ email });

        // Check if the user exists and if the provided password matches the stored hash.
        if (user && (await user.matchPassword(password))) {
            // If authentication is successful, return user data and a new token.
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generatetoken(user._id),
            });
        } else {
            // If authentication fails, return a 401 Unauthorized status.
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        // Handle potential server or database errors.
        res.status(500).json({ message: err.message });
    }
};
