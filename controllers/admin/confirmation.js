var user = require('../../models/user');
var mail = require('../../services/mailService');
var auth = require('../../middlewares/auth');

const allUser = async (req,res,next)=>{
    user.find({},function(err,result){
        if(err){
            console.log("some thing went wrong");
            res.status(500).json(err);
        }
        if(result.length===0){
            console.log('no USer');
            res.status(200).json({'error_code':200,'meassage':'no user','data':result});
        }
        else if(result.length!==0){
            res.status(200).json(result);
        }
    })
}

const approveUser = async (req,res,next)=>{
    user.findOneAndUpdate({'email':req.query.id},{$set:{'admin_confirmation':true}},function(err,result){
        if(err){
            
            res.status(500).json({'error_code':500,'data':err});
        }
        if(result===null){
            res.status(200).json({'error_code':200,'message':'User Not Found'});
        }else{
        mail.sendMailFunction(req.query.id,'Account Activated','','<b>Hi,<br><br>Thank you for registering with us.Your account is approved and ready to go.<br><br><br><br><b>Thank You.</b>');
        res.status(200).json(result);
        }
    })





}

const rejectUser = async (req,res,next)=>{
    user.findOneAndDelete({'email':req.query.id},function(err,result){
        if(err){
            res.status(500).json(err);
        }
        if(result===null){
            res.status(200).json({'error_code':'200','message':'User Not Found'});
        }
        else if(result.length!==0){
            mail.sendMailFunction(req.query.id,'Fail to activate Your account','','<b>Hi,<br><br>Sorry For the inconvenience.Your account cannot be approved at this time.<br>Please try again later<br><br><br><br><b>Thank You.</b>');
        res.status(200).json({
        
            'data':result});
        }
    
    })
}

module.exports = {
    allUser,
    approveUser,rejectUser
}