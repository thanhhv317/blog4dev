const Comments = require('../models/comments')

module.exports = {
    create: async (req, res) => {
        try {
            const { name, email, comment, postId } = req.body
            const checkEmailPattent = /[a-zA-Z-0-9\.\_]{1,}\@gmail\.com$/g
            if (!checkEmailPattent.test(email)) {
                return res.json({
                    status: false,
                    data: {
                        message: 'The email is not correct'
                    }
                })
            }
            const cmt = Comments.create({
                name,
                email,
                comment,
                postId,
                status: "INACTIVE"
            })
            if (!cmt) return res.status(500).json({
                status: false,
                data: {
                    message: "The was a problem when creating a comment"
                }
            })
            return res.status(200).json({
                status: true,
                data: cmt
            })
        }
        catch (e) {
            return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem',
                    e
                }
            })
        }
    },

    adminCreate: async (req, res) => {
        try {
            const { name, email, comment, postId } = req.body
            
            const cmt = Comments.create({
                name,
                email,
                comment,
                postId
            })
            if (!cmt) return res.status(500).json({
                status: false,
                data: {
                    message: "The was a problem when creating a comment"
                }
            })
            return res.status(200).json({
                status: true,
                data: cmt
            })
        }
        catch (e) {
            return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem',
                    e
                }
            })
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params
            const { name, email, comment } = req.body

            const cmt = await Comments.updateOne({_id: id}, 
                {name, email, comment, updateAt: Date.now()}
            )
            if (!cmt) return res.status(500).json({
                status: false,
                data: {
                    message: "The was a problem when updating a comment"
                }
            })
            return res.status(200).json({
                status: true,
                data: cmt
            })

        }
        catch (e) {
            return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem',
                    e
                }
            })
        }
    },

    changeStatus: async (req, res) => {
        try {
            const { id } = req.params
            const { status } = req.body
            const cmt = await Comments.update(
                {_id: id},
                {status}
            )
            if (!cmt) return res.status(500).json({
                status: false,
                data: {
                    message: "The was a problem when updating a comment"
                }
            })
            return res.status(200).json({
                status: true,
                data: cmt
            })
        }
        catch (e) {
            return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem',
                    e
                }
            })
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params
            const cmt = await Comments.update(
                {_id: id},
                {status: "DELETE"}
            )
            if (!cmt) return res.status(500).json({
                status: false,
                data: {
                    message: "The was a problem when deleting a comment"
                }
            })
            return res.status(200).json({
                status: true,
                data: cmt
            })
        }
        catch (e) {
            return res.status(500).json({
                status: false,
                data: {
                    message: 'There was a problem',
                    e
                }
            })
        }
    }
}