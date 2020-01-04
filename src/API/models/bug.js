const mongoose = require('mongoose');
const statuses = ['open', 'progress', 'testing', 'reopened', 'closed'];

const bugSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: false,
        default: 'open',
        validate(value) {
            if (!statuses.includes(value)) {
                throw new Error('Status set incorrectly')
            }
        }
    },
    owner: { // team
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Bug = mongoose.model('Bug', bugSchema)

module.exports = Bug