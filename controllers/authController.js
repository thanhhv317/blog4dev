const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../utils/config')
const Users = require('../models/users')

module.exports = {
    register: async (req, res) => {
        try {
            const {username, password, fullname, birthday} = req.body
            const checkUsername = /\s/g.test(username)
            if (checkUsername) return res.json({
                status: false,
                data: {
                    message: 'Validate username is not valid'
                }
            })
            const hashedPassword = bcrypt.hashSync(password, 8)
            const user = await Users.create({
                username,
                password: hashedPassword,
                fullname,
                birthday
            })
            if(user) {
                return res.status(200).json({
                    status: true,
                    data: user.toObject()
                })
            }
            return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem registering the user.'
                }
            })
        }
        catch (e) {
            return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem'
                }
            })
        }
    },

    login: async (req, res) => {
        try {
            const {username, password} = req.body
            if(/\s/g.test(username)) return res.json({
                status: false,
                data: {
                    message: 'Validate username is not valid'
                }
            })
            
            const user = await Users.findOne({username, status: "ACTIVE"}).exec()
            if (!user) {
                return res.status(200).json({
                    status: false,
                    data: {
                        message: 'No user found',
                    }
                })
            }
            const passwordIsValid = bcrypt.compareSync(password, user.password)
            if (!passwordIsValid) return res.status(401).json({
                status: false,
                data: {
                    token: null,
                    message: 'Password is not correct'
                }
            })
            
            const token = jwt.sign({id: user._id}, config.serect, {expiresIn: 86400})
            return res.status(200).json({
                status: true,
                data: {
                    token
                }
            })
            
        }
        catch (e) {
            return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem'
                }
            })
        }
    },

    getMe: async (req, res) => {
        try {
            const user = await Users.findById(req.userId, {password: 0})
            if (!user) return res.status(404).json({
                status: false,
                data: {
                    message: 'No user found'
                }
            })
            return res.status(200).json({
                status: true,
                data: user
            })
        }
        catch(e) {
            return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem'
                }
            })
        }
    }

}