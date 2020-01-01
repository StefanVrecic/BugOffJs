const mongoose = require('mongoose');
const statuses = ['open', 'progress', 'testing', 'reopened', 'closed'];

const taskSchema = new mongoose.Schema({
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
    // FOR LATER
    // description: type: string | reproducable: type: boolean | severity: type: number (1-5)
    // status: type: string (5 to choose from) | OS: type: string | due: type: date | etc.. 
    // | dateDiscovered: type: data|
    team: { // team
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Bug = mongoose.model('Bug', taskSchema)

module.exports = Bug