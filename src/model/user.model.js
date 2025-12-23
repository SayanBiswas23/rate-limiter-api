import mongoose from 'mongoose';

import bcrypt from 'bcryptjs';

const userSchmea = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name cannot be empty'],
        },
        email: {
            type: String,
            required: [true, 'Please enter your email'],
            minlength: 6,
        },
        password: {
            // Added password field
            type: String,
            required: [true, 'Please enter a password'],
            minlength: 6,
        },
    },
    {
        timestamps: true,
    },
);

userSchmea.pre('save', async function (next) {
    // Corrected typo: userSchmea to userSchema
    if (!this.isModified('password')) return next();
    // * Generate a "salt" (random data) to prevent Rainbow Table attacks
    const salt = await bcrypt.genSalt(10);
    // * Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchmea.methods.matchPassword = async function (enteredPassword) {
    // Renamed for consistency
    return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchmea);
