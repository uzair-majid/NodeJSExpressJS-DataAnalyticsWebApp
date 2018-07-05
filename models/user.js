var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const validator = require('validator');
const usererrorhandler = require('mongoose-mongodb-errors');
var UserSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        trim: true,
        validate: [validator.isEmail, 'invalid email address']
    }

});

UserSchema.plugin(usererrorhandler);

UserSchema.statics.saveUser = function (user) {

    //this.username = username;
    //this.password = password;
    //this.email = email;
    user.save();

}

UserSchema.statics.getUser = function (user) {

    //uname = user.username;
    // pass = user.password;
    //uemail = user.email;

    var result = this.findOne({

        $or: [
            { "username": user.username }, { "email": user.email }
        ]

    });

    return result;
}



module.exports = mongoose.model('User', UserSchema);