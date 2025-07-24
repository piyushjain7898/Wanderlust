const mongoose = require("mongoose");
const { use } = require("passport");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    email :{
        type : String,
        required : true,
        unique : true
    }
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
// This code defines a User model with an email field and integrates passport-local-mongoose for authentication
