const UserService = require('../services/users.service')
const bcrypt = require('bcrypt')
const { generateToken } = require('../utils/jwt')

class AuthController {
    async register(req, res){
        try {
            const result = await UserService.createUser(req.body)
            if (!result) return res.status(400).json({message: "Bad Request!"})
            return res.status(200).json(result)
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }

    async login(req, res){
        try {
            const { email, password } = req.body
            if (!email) return res.status(400).json({message: "Email is required!"})

            const user = await UserService.getUserByEmail(email);
            if (!user) return res.status(404).json({message: "User not found!"})

            console.log(user)

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({message: "Wrong Password!"})
            
            const token = generateToken({ uid: user.uid, role: user.role })
            return res.status(200).json({token})
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }
}

module.exports = new AuthController()