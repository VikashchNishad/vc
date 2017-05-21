var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	name: {
		type:String,
		required: true
	},
	email: {
		type: String,
		required: true
		
	},
	password: {
		type: String,
		required: true
	},
	active: {
		type: Boolean,
		required: true,
		default: false
	},
	temporarytoken: {
		type: String
	},
	resettoken: { 
		type: String, 
		required: false 
	}

});

userSchema.plugin(uniqueValidator);
mongoose.model('User', userSchema);