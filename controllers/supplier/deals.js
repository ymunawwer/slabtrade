const deal = require('../../models/deals');
const product = require('../../models/products');
const createDeal = async (req,res,next)=>{
    console.log(req.body)
   obj = deal.createDealBySupplier(req.body.product_type,req.body.offer_value,req.body.start_date,req.body.end_date,req.body.supplier_id);
   obj.then(function(){
    res.status(200).json({'error_code':200,'message':"deals created Succesfully"});
    product.find({}).exec(function(err,data){
        // console.log(data);
        data.forEach(el=>{
            if(el['product_type'] === req.body.product_type){
             let update =  product.updateMany({'product_type':req.body.product_type,'supplier_id':req.body.supplier_id},{$set:{'offer_value':req.body.offer_value,'start_date':req.body.start_date,'end_date':req.body.end_date,'isoffer':1}}).exec(function(err,data){
                 if(err){
                     console.log(err);
                 }
                 console.log(data)
             })
            }
        })
        // if(req.body.product_type = )
    })
   }).catch(function(err){
    console.log(err)
    res.status(200).json({'error_code':200,'message':"Please try again."});

   })

}

const getDeal = async (req,res,next)=>{
    deal.find({}).exec(function(err,data){
        if(err){
            res.status(500).json({
                "error_code":500,
                "message":"Please try again."
            })

        }else{
            res.status(200).json({
                "error_code":200,
                "message":"OK",
                "data":data
            })
        }
    })
}


module.exports = {
    createDeal,
    getDeal
}