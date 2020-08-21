const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default: 'https://nordiccoder.com/app/uploads/2019/12/50-javascript.jpg'
    },
    content: {
        type: String,
    },
    category: {
        type: String,
        default: '[]'
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        default: "ACTIVE",
        enum: ["ACTIVE","INACTIVE","DELETE"]
    },
    updateAt: {
        type: Date
    }
})

module.exports = mongoose.model('Posts', postSchema)