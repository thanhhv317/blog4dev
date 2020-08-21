const Posts = require('../models/posts')
const { convertText2Slug } = require('../utils/convertText2Slug')

module.exports = {
    getPost: async (req, res) => {
        try {
            const {id} = req.params
            
            const post = await Posts.findOne({_id: id, status: "ACTIVE"})

            if (!post) return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem'
                }
            })
            return res.status(200).json({
                status: true,
                data: {
                    post
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
            const {title, content, thumbnail, category} = req.body
            const slug = convertText2Slug(title)
            const post = await Posts.create({
                title,
                slug,
                thumbnail,
                content,
                category,
                authorId: req.userId
            })
            if (!post) return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem'
                }
            }) 
            return res.status(200).json({
                status: true,
                data: {
                    post
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
            const {id} = req.params
            const {title, content, thumbnail, category} = req.body
            const slug = convertText2Slug(title)
            const post = await Posts.updateOne(
                {_id: id}, 
                {title, slug, content, thumbnail, category, updateAt: Date.now()}    
            )
            if (!post) return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem'
                }
            })
            return res.status(200).json({
                status: true,
                data: {
                    post
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
            const {id} = req.params
            const post = await Posts.updateOne(
                {_id: id}, 
                {status: "DELETE", updateAt: Date.now()}    
            )
            if (!post) return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem'
                }
            })
            return res.status(200).json({
                status: true,
                data: {
                    post
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