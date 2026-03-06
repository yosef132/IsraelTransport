require('dotenv').config(); 
const jwt = require('jsonwebtoken');

function generateVerificationToken(userId) {
    const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

module.exports = { generateVerificationToken };
