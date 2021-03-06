const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid Email.'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.toJSON = function () { //filter response 
    let user = this
    let userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email'])
}

userSchema.methods.generateAuthToken = function () {
    let user = this
    let access = 'auth'
    let token = jwt.sign({ _id: user._id.toHexString(), access }, 'asd123').toString()

    user.tokens = user.tokens.concat([{access, token}])

    return user.save()
    .then(() => {
        return token
    })
}

userSchema.statics.findByToken = function (token) {
    var User = this
    var decoded

    try {
        decoded = jwt.verify(token, 'asd123')
    } catch (error) {
        return Promise.reject(error)
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.access': 'auth',
        'tokens.token': token
    })
}

userSchema.pre('save', function (next) {
    var user = this
    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })    
        })
    } else {
        next()
    }
})

let User = mongoose.model('User', userSchema)

module.exports = {
    User
}