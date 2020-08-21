const mongoose = require('mongoose')
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: "ACTIVE",
        enum: ["ACTIVE","INACTIVE","DELETE"]
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    updateAt: {
        type:Date
    }
})

module.exports = mongoose.model('Categories', categorySchema)