import express from 'express';
import dotenv from 'dotenv'; // Import dotenv and configure it
import connectDB from './src/config/db.js'; // Corrected import
import userroutes from './src/routes/users.routes.js';
import { ratelimiter } from './src/middleware/ratelimiter.middleware.js';
dotenv.config(); // Configure environment variables

const app = express();
// Connect to the database before starting the server
try {
    await connectDB();
    console.log('Database connected successfully');
} catch (error) {
    console.error("Fatal Error: Could not connect to the database", error.message);
    process.exit(1); // Exit the process if DB connection fails
}

app.use(express.json()); // Corrected middleware usage
// !global ratelimiter
app.use(ratelimiter);
// !rate limiter for expensive endpoints
app.use('/api/users', userroutes);
// //app.use('/api/users', ratelimiter);
app.get('/', (req, res) => {
    res.send(`API is runnnig `);
});

// Removed duplicate route. The first app.get('/') will handle requests to the root.

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`);
});
