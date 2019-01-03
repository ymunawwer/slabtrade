const deal = require('../../models/deals');
const product = require('../../models/products');
const createDeal = async (req,res,next)=>{
    console.log(req.body)
   obj = deal.createDeal(req.body.product_type,req.body.offer_value,req.body.start_date,req.body.end_date);
   obj.then(function(){
    res.status(200).json({'error_code':200,'message':"deals created Succesfully"});
    product.find({}).exec(function(err,data){
        // console.log(data);
        data.forEach(el=>{
            if(el['product_type'] === req.body.product_type){
             let update =  product.updateMany({'product_type':req.body.product_type},{$set:{'offer_value':req.body.offer_value,'start_date':req.body.start_date,'end_date':req.body.end_date}}).exec(function(err,data){
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


module.exports = {
    createDeal
}