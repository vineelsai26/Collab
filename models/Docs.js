const mongoose = require('mongoose')

const docsSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    accessList: {
        type: JSON,
        required: true
    },
})

module.exports = mongoose.model('Docs', docsSchema)