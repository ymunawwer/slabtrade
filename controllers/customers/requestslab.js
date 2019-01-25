var requestslab = require('../../models/request_slabs');
var Products = require('../../models/products');
var Users = require('../../models/user')
var mongoose = require('mongoose')

const create_request = async(req,res,next)=>{
    try{
        let product = await Products.find({'bundle_number':req.body.bundle_number})
        // console.log('product',product[0]['supplier_id'])
        let user = await Users.find({'_id':mongoose.Types.ObjectId(product[0]['supplier_id'])})
        // console.log('user',user)
    var request = requestslab.createRequest(req.body.first_name,user[0]['first_name'],req.body.product_name,req.body.bundle_number,req.body.action,req.body.type)
    request.then(function(data){
        res.status(200).json({"error_code":200,"data":data,"message":"Request Made."})

    }).catch(function(err){
        res.status(200).json({"error_code":200,"message":"Request is already exist.","data":err})
    })
    }catch(err){
        res.status(500).json({"error_code":500,"message":"please try again.","data":err})
    }

}

module.exports = {
    create_request
}