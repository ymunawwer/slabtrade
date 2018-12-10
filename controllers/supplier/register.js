var user = require('../../models/user');
var mail = require('../../services/mailService');
const register = async(req,res,next)=>{

var varuser = user.registerUser(req.body.alias,req.body.email,req.body.first_name, req.body.last_name,req.body.middle_name,req.body.password,req.body.home_phone,req.body.work_phone,req.body.cell_phone,'active',req.body.address,req.body.city,req.body.state,req.body.country,req.body.zip,'supplier');

 varuser.then(function(){
    mail.sendMailFunction(req.body.email,'Waiting For confirmation','Thank you for registering with us.<br>we inform you once your account is approved by admin','<b>Hi,</b><br>Thank you for registering with us.<br>We inform you once your account is approved by admin.<br><br><br><br>Thank You.</b>');
    mail.sendMailFunction('yaseen@gamasome.com','Supplier register','new supplier register wiating for confirmation','<br><b>Hi,</b><br>new <b>supplier</b> register waiting for confirmation.<br><br><br><br><b>Thank You.');

    res.status(200).json({'error_code':200,'message':"register Succesfully"});
}).catch(function(err){
    mail.sendMailFunction(req.body.email,'Registration failed','Sorry for the inconvenience','<b>Hi,</b><br>Sorry for the inconvenience.<br><br><br><br><b>Thank You.</b>');
    res.status(200).json({'error_code':200,'message':"registeration Failed"});
});


}
module.exports={
    register
}