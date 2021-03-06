const Categories = require('../models/categories')

module.exports = {
    getCategory: async (req, res) => {
        try {
            const { id } = req.params
            const category = await Categories.findOne({_id: id, status: "ACTIVE"}).exec()
            if (!category) return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem'
                }
            })
            return res.status(200).json({
                status: true,
                data: {
                    category
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

    getCateogies: async (req, res) => {
        try {
            const category = await Categories.find({status: {$ne: "DELETE"}})
            
            if (!category) return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem'
                }
            })
            return res.status(200).json({
                status: true,
                data: {
                    category
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

    getCateogiesForCreatePosts: async (req, res) => {
        try {
            const category = await Categories.find({status: "ACTIVE"})
            
            if (!category) return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem'
                }
            })
            return res.status(200).json({
                status: true,
                data: {
                    category
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

    create: async (req, res) => {
        try {
            const { name, description } = req.body
            const category = await Categories.create({
                name,
                description
            })
            if (!category) return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem'
                }
            })
            return res.status(200).json({
                status: true,
                data: {
                    category
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

    update: async (req, res) => {
        try {
            const { id } = req.params
            const { name, description, status } = req.body
            const category = await Categories.updateOne({_id: id}, {
                name,
                description,
                status,
                updatedAt: Date.now()
            })
            if (!category) return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem'
                }
            })
            return res.status(200).json({
                status: true,
                data: {
                    category
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

    delete: async (req, res) => {
        try {
            const { id } = req.params
            const category = await Categories.updateOne(
                {_id: id}, 
                {status: "DELETE", updatedAt: Date.now()}
            )   
            if (!category) return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem'
                }
            })
            return res.status(200).json({
                status: true,
                data: {
                    category
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
    }
}