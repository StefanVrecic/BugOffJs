const mongoose = require('mongoose');
const statuses = ['Open', 'In progress', 'To be tested', 'Re-opened', 'Closed'];

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