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
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    admin: {
        type: Boolean
    },

    drawer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

const Room = mongoose.model('Room', roomSchema)

module.exports = { Room }