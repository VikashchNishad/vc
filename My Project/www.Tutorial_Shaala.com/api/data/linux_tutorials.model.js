	var mongoose = require('mongoose');
    var uniqueValidator = require('mongoose-unique-validator');
	// *ALL subschema should be define above the mainschema.....

	//	subschema for reviews...
	var linux_commentSchema = new mongoose.Schema({
		name : {
			type : String,
			required : true
		},
		linux_comment : {
			type : String,
			required : true
		},
		createdOn : {
			type : Date,
			"default" : Date.now
		}
	});


	//Defining the main devops_tutorialSchema schema......
	var linux_tutorialSchema = new mongoose.Schema({
		name : {
			type : String,
			 index: true, 
			 unique: true,
			required : true         // Each hotel should have name.....(This path should have value)
		},
		id: {
			type : Number, 
			 unique: true,
			required : true  
		},
		//Referencing the subschema in to main schema.....
		linux_comments : [linux_commentSchema],
	});

    linux_tutorialSchema.plugin(uniqueValidator);
	/* Application uses model to interact with schema..So we have to compile schema into model..*/
	mongoose.model('linux_tutorial', linux_tutorialSchema);
