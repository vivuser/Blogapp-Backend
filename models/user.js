const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    gitHubId: { type: String, unique: true },
    name: {
        type: String,
    },
    email: {
        type : String,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email!`, 
        },
    },
    password: {type: String, minLength: 6,},
    token: String,
    confirmPassword: {type: String, minLength: 6,},
    token: String,
    userId: {type:String},
    topics: [{ type: String }],
});

exports.User = mongoose.model('User', userSchema);