const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const MessageSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    author: {
        type: String,
    }
});

module.exports = mongoose.model('Message', MessageSchema);