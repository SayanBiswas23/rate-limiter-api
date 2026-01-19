import express from 'express';
import dotenv from 'dotenv'; // Import dotenv and configure it
import connectDB from './src/config/db.js'; // Corrected import
import userroutes from './src/routes/users.routes.js';
import { ratelimiter } from './src/middleware/ratelimiter.middleware.js';
dotenv.config({
});

const app = express();
// Connect to the database before starting the server
try {
    await connectDB();
} catch (error) {
    res.status(500).json({
        msg: 'Database connection failed;',
    });
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
