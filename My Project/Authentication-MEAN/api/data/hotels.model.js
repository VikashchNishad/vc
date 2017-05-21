	var mongoose = require('mongoose');

	// *ALL subschema should be define above the mainschema.....

	//	subschema for reviews...
	var reviewSchema = new mongoose.Schema({
		name : {
			type : String,
			required : true
		},
		rating : {
			type : Number,
			min : 0,
			max : 5,
			required : true
		},
		review : {
			type : String,
			required : true
		},
		createdOn : {
			type : Date,
			"default" : Date.now
		}
	});

	// subschema for rooms....
	var roomSchema = new mongoose.Schema({
		type : String,
		number : Number,
		description : String,
		photos : [String],
		price : Number
	});

	//Defining the main Hotel schema......
	var hotelSchema = new mongoose.Schema({
		name : {
			type : String,
			required : true        // Each hotel should have name.....(This path should have value)
		},
		stars : {
			type : Number,
			min : 0,                  // min value of stars
			max : 5,				  // max value of stars
			"default" : 0			 // setting default value 0
		},
		services :[String],
		description : String,
		photos : [String],
		currency : String,
		//Referencing the subschema in to main schema.....
		reviews : [reviewSchema],
		rooms : [roomSchema],
		//schema for geo-location...
		location : {
			address : String,
			// Allways store coordinates longitude (E/W), latitude (N/S)...
			coordinates :{
			type : [Number],
			index : '2dsphere'
		   }
		}
	});

	/* Application uses model to interact with schema..So we have to compile schema into model..*/
	mongoose.model('Hotel', hotelSchema);
	/*model is compile version of schema and a single instance of the
	  model actually has a direct one to one relationship with single 
	  document in the database.
	   So all data interactions using mongoose need to go through
       the model.
       Here name of model is 'Hotel' ...
	  */