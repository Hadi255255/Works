const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const eventSchema = mongoose.Schema({
    email: {
        type: String,
    },
    signupDate: {
        type: Date,
    },
    signinDate: {
        type: Date,
    },
    deleteAccountDate: {
        type: Date,
    },
},);
const Events = mongoose.model('Events', eventSchema);
module.exports = Events;
