const jwt = require('jsonwebtoken')
require('dotenv').config()

function generateToken(payload){
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN || '1h'
    })
}

function verifyToken(token){
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return null
    }
}

module.exports={
    generateToken,
    verifyToken  
}