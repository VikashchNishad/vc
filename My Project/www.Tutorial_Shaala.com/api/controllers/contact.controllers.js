
var mongoose = require('mongoose');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
service: 'Gmail',
auth: {
    user: 'vchnadrak425@gmail.com',
    pass: 'vikdonoo7'
}
});
/*
 * Send an email when the contact from is submitted
 */
module.exports.send_mail = function(req, res) {

		var data = req.body;

		transporter.sendMail({
	        from: '"Tutorial Shaala" <vchadra425@gmail.com>',
	        to: 'vchnadrak425@gmail.com',
	        subject: 'Message from ' + data.contactName,
	        text: 'You have a new submission with following details...Name: '+data.contactName+ ' Email: '+data.contactEmail+ ' Massage: '+data.contactMsg+'',
            html: '<p>You have a new submission with following details...</p><ul><li>Name: '+data.contactName+ '</li><li>Email: '+data.contactEmail+ '</li><li>Massage: '+data.contactMsg+'</li></ul>' 
        },function(err, User){
			if(err){
				res.status(401).json(err);
			} else{
				console.log('Message has been send');
					res.status(200).json({ success: true, message: 'Massage has been successfully sent.'})
			}
		});
		res.status(200).json({ success: true, message: 'Massage has been successfully sent.'})
	}