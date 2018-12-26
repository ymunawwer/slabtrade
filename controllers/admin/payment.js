var Order = require('../../models/order');
var mongoose = require('mongoose');
var mailService = require('../../services/mailService')
wiredDocUpdate = async(req,res,next)=>{
    if(req.files){
        req.files.forEach(function(file){
            
            docs.push({'path':file.location});
                
            });
        
     
        Order.updateOne({'_id':mongoose.Types.ObjectId(req.body._id)},{$set:{'wired_doc':docs}},(err,result)=>{
           
            if(err){
                console.log(err)
                res.status(500).json({
                    'error_code':500,
                    'message':err
                })
            }
            else if(!err){
                console.log()
                if(result.nModified!==0){
                    //To is admin email
                    mailService.sendMailFunction('admin@slabtrade.com','Wired Doc uploaded','','<b>Hi</b><br>Payment detail uploaded.<br><br><b>Thank You.</b>')
            res.status(200).json({
                'error_code':200,
                'message':'Updated Succesfully'})
            }
            else if(result.nModified===0){
                res.status(200).json({
                    'error_code':200,
                    'message':'Order id is not valid.'})
                }
            }
        
            
        })
    } 
}


updateStatus = async(req,res,next)=>{

    Order.updateOne({'_id':mongoose.Types.ObjectId(req.query.id)},{$set:{'payment_status':req.query.status,'payment':req.query.payment}},(err,result)=>{
           
        if(err){
            console.log(err)
            res.status(500).json({
                'error_code':500,
                'message':err
            })
        }
        else if(!err){
            console.log()
            if(result.nModified!==0){
                //To is admin email
                mailService.sendMailFunction('admin@slabtrade.com','Payment Status Update','','<b>Hi</b><br>Ready for the shipment.<br><br><b>Thank You.</b>')
        res.status(200).json({
            'error_code':200,
            'message':'Updated Succesfully'})
        }
        else if(result.nModified===0){
            res.status(200).json({
                'error_code':200,
                'message':'Order id is not valid.'})
            }
        }
    
        
    })
    
}

module.exports = {
    updateStatus
}