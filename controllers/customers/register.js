var user = require('../../models/user');
const register = async(req,res,next)=>{
console.log(req.body.email);
var varuser = user.registerUser(req.body.alias,req.body.email,req.body.first_name, req.body.last_name,req.body.middle_name,req.body.password,req.body.home_phone,req.body.work_phone,req.body.cell_phone,'active',req.body.address,req.body.city,req.body.state,req.body.country,req.body.zip,'customer');

 varuser.then(function(){
    mail.sendMailFunction(req.body.email,'Waiting For confirmation','Thank you for registering with us.<br>we inform you once your account is approved by admin','<b>Hi,</b><br>Thank you for registering with us.<br>we inform you once your account is approved by admin.<br><br><br><br><b>Thank You.</b>');
    mail.sendMailFunction('yaseen@gamasome.com','Customer register','new Customer register waiting for confirmation','<br><b>Hi,</b><br>new <b>Customer</b> register waiting for confirmation.<br><br><br><br><br><br><b>Thank You.');

  res.status(200).json({'error_code':200,'message':"user register Succesfully"});
}).catch(function(err){
    mail.sendMailFunction(req.body.email,'Registration failed','Sorry for the inconvenience','<b>Hi,</b><br>Sorry for the inconvenience.<br><br><br><br>><b>Thank You.</b>');
    res.status(500).json({'error_code':500,'message':"user register Failed"});
});


}
module.exports={
    register
}