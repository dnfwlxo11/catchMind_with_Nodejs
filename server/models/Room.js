const mongoose = require('mongoose');
const { User } = require('./User');
const Schema = mongoose.Schema;

const roomSchema = Schema({
    room: {
        type: String,
        maxlength: 50
    },

    users: [
        {
            type: String
        }
    ],

    admin: {
        type: Boolean
    },

    drawer: {
        type: Boolean
    }
}, { timestamps: true })

const Room = mongoose.model('Room', roomSchema)

module.exports = { Room }