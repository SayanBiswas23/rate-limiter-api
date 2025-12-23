import express from 'express';
import { registerUser, loginuser } from '../controllers/user.controller.js';
import { protect } from '../middleware/middleware.authmiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginuser);

router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

export default router;
