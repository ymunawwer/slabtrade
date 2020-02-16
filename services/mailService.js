'use strict';
const nodemailer = require('nodemailer');




 

    
    var sendMail = async(req,res,next)=>{
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,              // TLS (google requires this port for TLS)
            secure: false,          // Not SSL
            requireTLS: true,
            auth: {
                user: '', // generated ethereal user
                pass: '' // generated ethereal password
            }
        });
        let mailOptions = {
            from: '"SlabTrade 👻" <slabtrade.us@gmail.com>', // sender address
            to: req.body.to, // list of receivers
            subject: req.body.sub, // Subject line
            text: req.body.txt, // plain text body
            html: req.body.htmltext // html body
        };

       
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(535).json({'error_code':535,'message':error});
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        next();

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
    }




    function sendMailFunction(to,sub,txt,htmltext,attachments){
        
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,              // TLS (google requires this port for TLS)
            secure: false,          // Not SSL
            requireTLS: true,
            auth: {
                user: 'slabtrade.us@gmail.com', // generated ethereal user
                pass: 'SlabTradeUs123' // generated ethereal password
            }
        });
        let mailOptions = {
            from: '"SlabTrade 👻" <slabtrade.us@gmail.com>', // sender address
            to: to, // list of receivers
            subject: sub, // Subject line
            text: txt, // plain text body
            html: htmltext, // html body
            attachments:attachments
        };

       
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return false;
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        //next();
        return true;

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });

    }
    


module.exports = {
    sendMail,sendMailFunction
}
