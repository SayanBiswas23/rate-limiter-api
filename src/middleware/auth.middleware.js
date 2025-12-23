import jwt from 'jsonwebtoken';
import { User } from '../model/user.model.js';

// Middleware to protect routes, ensuring only authenticated users can access them.
export const protect = async (req, res, next) => {
    let token;

    // Check if authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the Authorization header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the JWT_SECRET from environment variables
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by ID from the decoded token and attach it to the request object
            // Exclude the password field for security
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            res.status(401).json({
                // Use 401 for unauthorized
                message: 'Not authorized, token verification failed',
            });
        }
    }
    if (!token) {
        res.status(401).json({
            // Use 401 for unauthorized
            message: 'Authorization failed, no token provided',
        });
    }
};
