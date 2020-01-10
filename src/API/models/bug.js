const mongoose = require('mongoose');
const statuses = ['Open', 'In progress', 'To be tested', 'Re-opened', 'Closed'];

const bugSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        default: 'No description provided'
    },
    severity: {
        type: String,
        default: 'None',
        required: true
    },
    status: {
        type: String,
        required: false,
        default: 'Open',
        validate(value) {
            if (!statuses.includes(value)) {
                throw new Error('Status set incorrectly')
            }
        }
    },
    bugReproducible: { // todo
        type: String,
        default: 'None',
        required: true
    },
    dueDate: {
        type: Date,
        required: false
    },
    reminder: {// todo
        type: Date,
        required: false
    },
    dueDateEnabled: {// todo
        type: Boolean,
        required: false
    },
    dueDatePassed: {
        type: Boolean,
        required: false
    },
    overdueConfirmed: {
        type: Boolean,
        required: false
    },
    activity: {
        type: Array,
        required: false
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