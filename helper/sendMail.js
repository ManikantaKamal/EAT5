/**
 * Author: kamal G
 * date: 1-1-2017
 * Description: The sendMail.js will use to do send email.
 * 
 */

var nodemailer = require('nodemailer');
var config = require('../helper/config');
 
module.exports = {
		
		// sendMail function is used to send emails
		sendMail: function(to,data,subject) {
			console.log("Send mail entered");
			// create reusable transporter object using the default SMTP transport 
			var transporter = nodemailer.createTransport('smtps://'+config.email_id+'%40gmail.com:'+config.email_password+'@smtp.gmail.com');
			
			// setup e-mail data with unicode symbols 
			var mailOptions = {
			    from: '"EAT5  👥" <'+config.email_id+'@gmail.com>', // sender address 
			    to: to, // list of receivers 
			    subject: subject, // Subject line 
			    html: data // html body
			};
			
			
			// send mail with defined transport object 
			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        return console.log(error);
			    }
			    console.log('Message sent: ' + info.response);
			});
		}
		

}