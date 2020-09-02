const Posts = require('../models/posts')
const { convertText2Slug } = require('../utils/convertText2Slug')

module.exports = {
    getPost: async (req, res) => {
        try {
            const { id } = req.params

            const post = await Posts.findOne({ _id: id, status: "ACTIVE" })

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
            const thumbnail = req.files[0].path;
            const { title, content, category } = req.body
            const slug = convertText2Slug(title)
            let categories = [];
            categories = category.split(",");
            const post = await Posts.create({
                title,
                slug,
                thumbnail,
                content,
                category: categories,
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
            console.log(e)
            return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem',
                }
            })
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params
            const { title, content, thumbnail, category } = req.body
            const slug = convertText2Slug(title)
            const post = await Posts.updateOne(
                { _id: id },
                { title, slug, content, thumbnail, category, updateAt: Date.now() }
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
            const { id } = req.params
            const post = await Posts.updateOne(
                { _id: id },
                { status: "DELETE", updateAt: Date.now() }
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

    getList: async (req, res) => {
        try {
            const posts = await Posts.find({ status: { $ne: "DELETE" } })
                .populate({
                    path: "category",
                    match: {
                        status: "ACTIVE"
                    },
                    select: "name _id"
                }).populate({
                    path: "authorId",
                    match: {
                        status: "ACTIVE"
                    },
                    select: "username _id"
                });

            if (!posts) return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem'
                }
            })
            return res.status(200).json({
                status: true,
                data: {
                    posts
                }
            })
        }
        catch (e) {
            return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem',
                    error: e
                }
            })
        }
    }
}