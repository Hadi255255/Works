const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const eventSchema = mongoose.Schema({
    email: {
        type: String,
    },
    signupDate: {
        type: String,
    },
    signinDate: {
        type: String,
    },
    deleteAccountDate: {
        type: String,
    },
},);
const Events = mongoose.model('Events', eventSchema);
module.exports = Events;
