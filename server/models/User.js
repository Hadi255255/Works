const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
        // required: true
    },
    displayName: {
        type: String,
        // required: true
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    fullName: {
        type: String,
    },
    paramsName: {
        type: String,
    },
    speciality: {
        type: String,
        default: ''
    },
    education: {
        type: String,
        default: ''
    },
    skills: {
        type: String,
        default: ''
    },
    profileImage: {
        type: String,
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    confirmed: {
        type: String,
        default: 'false'
    },
    sendLink: {
        type: Number,
        default: 1
    },
    image: {
        type: String,
        default: '/img/user/image.png'
    },
    resume: {
        type: String,
        default: '/img/user/noresume.pdf'
    },
    works: {
        type: [],
        default: []
    },
    orderWorks: {
        type: String,
        default: 'newest',
    },
    birthday: {
        type: Date,
    },
    gender: {
        type: String,
        default: ''
    },
    location: {
        type: String,
    },
    timeZone: {
        type: String,
    }
},);
userSchema.methods.hashPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
