var user = require('../../models/user');
var mail = require('../../services/mailService');
var randomstring = require("randomstring");
const register = async(req,res,next)=>{
    console.log(req.body.data);
    
    pass = randomstring.generate({
        length: 6,
        charset: 'alphanumeric'
      });
      console.log(pass)
    
    
    var varuser = user.registerUser(req.body.alias,req.body.data.email,req.body.data.first_name, req.body.data.last_name,req.body.data.middle_name,pass,req.body.data.home_phone,req.body.data.work_phone,req.body.data.cell_phone,'active',req.body.data.address,req.body.data.city,req.body.data.state,req.body.data.country,req.body.data.zip,'supplier',req.body.data.mailing_address,req.body.data.mailing_city,req.body.data.mailing_state,req.body.data.mailing_country,req.body.data.mailing_zip);
    
     varuser.then(function(){
        mail.sendMailFunction(req.body.data.email,'Waiting For confirmation','Thank you for registering with us.<br>we inform you once your account is approved by admin','<b>Hi,</b><br>Thank you for registering with us.<br>Password:'+pass+'<br><br>we inform you once your account is approved by admin.<br><br><br><br><b>Thank You.</b>');
        mail.sendMailFunction('yaseen@gamasome.com','Supplier register','new Supplier register waiting for confirmation','<br><b>Hi,</b><br>new <b>Supplier</b> register waiting for confirmation.<br><br><br><br><br><br><b>Thank You.');
    
      res.status(200).json({'error_code':200,'message':"Supplier register Succesfully"});
    }).catch(function(err){
        mail.sendMailFunction(req.body.data.email,'Registration failed','Sorry for the inconvenience','<b>Hi,</b><br>Sorry for the inconvenience.<br><br><br><br>><b>Thank You.</b>');
        res.status(500).json({'error_code':500,'message':"Supplier register Failed"});
    });
    
    
    }


const getUserName = async(req,res,next)=>{
    user.findById(req.query.id).exec((err,result)=>{
        if(err){
            res.status(500).json({
                "error_code":500,
                "message":"Please try again",

            })
        }  if(result!==null){
        res.status(200).json({
          
            "error_code":200,
            "data":result.first_name
            
        })
    }else{
        next();
    }
    })
}
module.exports={
    register,getUserName
}