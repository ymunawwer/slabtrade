var requestslab = require('../../models/request_slabs');
var Products = require('../../models/products');
var Users = require('../../models/user')
var mongoose = require('mongoose')


const getSlabRequest = async(req,res,next)=>{
    requestslab.find().exec(function(err,result){
        if(err){
            res.status(500).json({"error_code":500,"message":"Please try again."})
        }
        res.status(200).json({"error_code":200,"message":"List of slab request.","data":result})
    })
}


const confirmRequest = async(req,res,next)=>{
    requestslab.findOneAndUpdate({'_id':req.query.id},{$set:{'action':req.query.action}}).exec(function(err,result){
        if(err){
            res.status(500).json({"error_code":500,"message":"Please try again."})
        }
        if(req.query.action==='0'){
            res.status(200).json({"error_code":200,"message":"Status Changed to pending."})
        }else if(req.query.action==='1'){
            res.status(200).json({"error_code":200,"message":"Status Changed to fullfiled."})

        }
       
    })
}


module.exports = {
    getSlabRequest,
    confirmRequest

}