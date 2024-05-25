const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('../routes/auth')


const NoteSchema = new Schema({
    userEmail: {
        type: String,
        required: true

    },
    userFullName: {
        type: String,
    },
    userParamsName: {
        type: String,
    },
    user: {
        type: Schema.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    image: {
        type: String,
    },
    groupImages: {
        type: [],   // or Array
        default: ''
    },
    firstFileType: {
        type: String,
    },
    align: {
        type: String,
        default: 'left',
    },
    direction: {
        type: String,
        default: 'ltr',
    },
    links: {
        type: {
            linkTitle: [],
            linkValue: [],
        },
        default: {
            linkTitle: [],
            linkValue: [],
        }
    }
})


const Notes = mongoose.model('Note', NoteSchema);
module.exports = Notes;