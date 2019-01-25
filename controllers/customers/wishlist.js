const Product = require('../../models/products');
const mongoose = require('mongoose')

const addToFav = async (req, res, next) => {

    Product.findOneAndUpdate({'bundle_number':req.query.bundle_number},{$push:{'wishlist':mongoose.Types.ObjectId(req.query.user_id)}}).exec(function(err,result){
if(err){
    res.status(500).json({"error_code":500,
                        "message":"Please try again later.Something went Wrong."})
}
res.status(200).json({"error_code":200,
"message":"Item Saved As favourite."})
    })


}


const removeFromFav = async (req, res, next) => {

    Product.findOneAndUpdate({'bundle_number':req.query.bundle_number},{$pull:{'wishlist':mongoose.Types.ObjectId(req.query.user_id)}}).exec(function(err,result){
if(err){
    res.status(500).json({"error_code":500,
                        "message":"Please try again later.Something went Wrong."})
}
res.status(200).json({"error_code":200,
"message":"Item Saved As favourite."})
    })


}



module.exports = {
    addToFav,
    removeFromFav
}