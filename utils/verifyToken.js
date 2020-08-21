const jwt = require('jsonwebtoken')
const config = require('./config')

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token']
    if (!token) 
        return res.status(403).json({
            status: false,
            data: {
                message: 'No token provided'
            }
        })
    
    jwt.verify(token, config.serect, (err, data) => {
        if (err) 
            return res.status(500).json({
                status: false,
                data: {
                    message: 'Failed to authenticate token'
                }
            })
        
        // if everything good, save to request for use in other routes
        req.userId = data.id
        next()
    })
}