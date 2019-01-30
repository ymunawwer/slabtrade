const product = require('../../models/products')
const editSlabPercent = async(req,res,next)=>{
    product.update({'_id':req.body.id},{$set:{'slab_percentage':req.body.percentage}}).exec(function(err,result){
        if(err){
            res.status(500).json({
                "error_code":500,
                "data":"Please try again."
            })

        }else{
            res.status(200).json({
                "error_code":200,
                "data":"Percentage Updated."
            })

        }
    })
}
module.exports = {
    editSlabPercent
}