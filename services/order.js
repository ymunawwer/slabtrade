var Order = require('../models/order');
var mailService = require('../services/mailService')
var User = require('../models/user')
var mongoose = require('mongoose');
var products = require('../models/products')


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
       
        
        else{
        res.status(200).json({'error_code':200,'data':result});
        }
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
    console.log("vg")
    Order.findOneAndUpdate({'_id':req.body._id},{$set:{'cancel_status':req.body.status}}).exec((err,result)=>{
        if(err){
            res.status(500).json({
                'status_code':500,
                'message':'Please try again later.'
            })
        }if(result.length!==null){
            User.findById(result.user_id).exec((err,result)=>{
                mailService.sendMailFunction(result.email,'Order'+req.body.status +  'mail','','<b>Hi</b><br>Your Order is'+req.body.status+' by the Supplier.<br><br><br><b>Thank You')
            })
          
            res.status(200).json({
                'error_code':200,
                'Message':'order '+req.body.status +' succesfully'
                
            })
        }
            else{
                res.status(200).json({
                    'error_code':200,
                    'data':result,
                    'message':'invalid order id'
                })
            }
        
    })

}


const getallorderBySupplier = function(req,res,next){
  
    Order.aggregate([
        {$match: {'products.supplier_id': mongoose.Types.ObjectId(req.query.id)}},
        {$project: {
                name: 1,
            user_id:1,
            payment:1,
            created_at:1,
            cancel_status:1,
            total:1,
            _id:1,
            
               products: {$filter: {
                   input: '$products',
                   as: 'products',
                   cond: {$eq: ['$$products.supplier_id', mongoose.Types.ObjectId(req.query.id)]}
               }},
              
           }}
        ]).exec(function(err,result){
        if(err){
            res.status(500).json({
                "error_code":500,
                "message":"please try again"
            })
        }
        
        if(result.length!==0){
       
            // console.log(result[0]['products'])
            res.status(200).json({
                
                "error_code":200,
                "message":"list of orders",
                "data":result
            })
        }else{
            res.status(200).json({
                "error_code":200,
                "message":"No order",
                "data":result
            })

        }
    })



}


const getallOrderByCustomer = function(req,res,next){
  
    Order.find({'user_id':req.query.id}).exec(function(err,result){
        if(err){
            res.status(500).json({
                "error_code":500,
                "message":"please try again"
            })
        }
     
        if(result.length!==0){
            
            res.status(200).json({
                
                "error_code":200,
                "message":"list of orders",
                "data":result
            })
        }else{
            res.status(200).json({
                "error_code":200,
                "message":"No order",
                "data":result
            })

        }
    })



}







const getOrderDetail =async (req,res,next)=>{

    Order.findById(req.query.id).exec(function(err,result){
        if(err){
            res.status(500).json({
                "error_code":500,
                "message":"Please try again later"
            })
        }
        else{
            res.status(200).json({
                "error_code":200,
                "message":"Order Details",
                "data":result
            })
        }
    })


}

getShippingDoc = async (req,res,next)=>{
    Order.find({
        '_id': req.query.id
    }, function (err, result) {
        if (err) {
            res.status(500).json({
                'error_code': 500,
                'message': err
            });
        } else if (result.length === 0) {

            res.status(200).json({
                'error_code': 200,
                'message': 'There is no product'
            });
        } else if (result.length > 0) {
            let docs = []
            result[0]['shipping_doc'].forEach((doc)=>{
                docs.push(doc.path)
            })
            // res.attachment('Product_info.csv');
            res.status(200).send({"error_code":200,"data":docs});
        }
    })



}


getWiredDoc = async (req,res,next)=>{
    Order.find({
        '_id': req.query.id
    }, function (err, result) {
        if (err) {
            res.status(500).json({
                'error_code': 500,
                'message': err
            });
        } else if (result.length === 0) {

            res.status(200).json({
                'error_code': 200,
                'message': 'There is no product'
            });
        } else if (result.length > 0) {
            let docs = []
            
            console.log(result)
            // docs.push(result[0]['payment_status'])
            result[0]['wired_doc'].forEach((doc)=>{
                docs.push(doc.path)
            })
            let obj = {
                "docs":docs,
                "payment_status":result[0]['payment_status'],
                "payment_mode":result[0]['payment']
            }
            // res.attachment('Product_info.csv');
            res.status(200).send({"error_code":200,"data":obj});
        }
    })



}





module.exports = {
    getOrderList,
    getPendingOrderList,
    getApprovedOrderList,
    orderStatus,
    getallorderBySupplier,
    getallOrderByCustomer,
    getOrderDetail,getShippingDoc,
    getWiredDoc

}

