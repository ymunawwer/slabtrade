var Order = require('../models/order');
var mailService = require('../services/mailService')
var User = require('../models/user')


const getOrderList = function(req,res,next){
    console.log('hello');
    // Order.find({}).populate('users').exec(function(err,result){
    //     if(err) {
    //         console.log(err);
    //         return err;
    //     }
    //     console.log(result);
    //     return result;
    // });


    Order.aggregate([
     
        {
            $lookup:{
                from:"users",
                let:{"user_id":"$user_id"},

                pipeline: [
                    { "$addFields": { "userId": { "$toObjectId": "$_id" }}},
                    { "$match": { "$expr": { "$eq": [ "$userId", "$$user_id" ] } } }
                  ],
                  
                // foreignfield:"_id",
                as : "user_info"
            }
        },{
            $unwind:({ path: "$user_info", preserveNullAndEmptyArrays: true })
        },{
        $project:{"user_info":{"password":0,"roles":0,"userId":0,"admin_confirmation":0,"_id":0}}},

        {
            $lookup:{
                from:"users",
                let:{"supplier_id":"$supplier_id"},

                pipeline: [
                    { "$addFields": { "supplierId": { "$toObjectId": "$_id" }}},
                    { "$match": { "$expr": { "$eq": [ "$supplierId", "$$supplier_id" ] } } }
                  ],
                  
                // foreignfield:"_id",
                as : "supplier_info"
            }
        },{
            $unwind:({ path: "$supplier_info", preserveNullAndEmptyArrays: true })
        },
        {$project:{"supplier_info":{"password":0,"roles":0,"supplierId":0,"admin_confirmation":0,"_id":0}}},
        {
            $lookup:{
                from:"products",
                let:{"bundle_id":"$bundle_id"},

                pipeline: [
                    { "$addFields": { "bundleId": { "$toObjectId": "$_id" }}},
                    { "$match": { "$expr": { "$eq": [ "$bundleId", "$$bundle_id" ] } } }
                  ],
                  
                // foreignfield:"_id",
                as : "bundle_info"
            }
        },{
            $unwind:({ path: "$bundle_info", preserveNullAndEmptyArrays: true })
        },
        // {$project:{"bundle_info":{"_id":0}}}

        


    ]).exec(function(err,result){
        if(err){
            res.status(500).json({"error_code":500,"message":err})
            
        }
        console.log(result);
        
        res.status(200).json(result);
    })
   


}



const getPendingOrderList = function(req,res,next){
    Order.find({'cancel_status':'pending'}).exec((err,result)=>{
        if(err){
            res.status(500).json({
                'status_code':500,
                'message':'Please try again later.'
            })
        }if(result.length!==null){
            res.status(200).json({
                'status_code':200,
                'data':result
            })
        }else{
            res.status(200).json({
                'status_code':200,
                'data':result,
                'message':'No pending orders'
            })
        }
        
    })
}




 const getApprovedOrderList = function(req,res,next){
        Order.find({'cancel_status':'approved'}).exec((err,result)=>{
            if(err){
                res.status(500).json({
                    'status_code':500,
                    'message':'Please try again later.'
                })
            }if(result.length!==null){
                res.status(200).json({
                    'status_code':200,
                    'data':result
                })
            }
                else{
                    res.status(200).json({
                        'status_code':200,
                        'data':result,
                        'message':'No orders Approved'
                    })
                }
            
        })

}


const orderStatus = function(req,res,next){
    Order.findOneAndUpdate({'_id':req.body._id},{$set:{'cancel_status':req.body.status}}).exec((err,result)=>{
        if(err){
            res.status(500).json({
                'status_code':500,
                'message':'Please try again later.'
            })
        }if(result.length!==null){
            User.findById(result.user_id).exec((err,result)=>{
                mailService.sendMailFunction(result.email,'Order cancel Confirmation mail','','<b>Hi</b><br>Sorry for the inconvenience<br><br><br><b>Thank You')
            })
          
            res.status(200).json({
                'status_code':200,
                'Message':'order '+req.body.status +' succesfully'
                
            })
        }
            else{
                res.status(200).json({
                    'status_code':200,
                    'data':result,
                    'message':'invalid order id'
                })
            }
        
    })

}




module.exports = {
    getOrderList,
    getPendingOrderList,
    getApprovedOrderList,
    orderStatus

}

