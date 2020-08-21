//must be middleware verifyToken
const Users = require('../models/users')

module.exports = async (req, res, next) => {
    const user = await Users.findById(req.userId, {password: 0})
    const userLevel = user.level
    if (userLevel == 0) next()
    else return res.status(403).json({
        status: false,
        data: {
            message: 'You are not permission of Super Admin'
        }
    }) 
}