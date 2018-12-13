const Cart = require('../../models/cart');
var Order = require('../../models/order');


const deleteAllItemFromCart = async (req, res, next) => {
    console.log(req.body);
    
    Cart.findOneAndDelete({ 'user_id': req.body.id }, function(err,result) {
        console.log(result);
        if (result) {
            console.log('cart is clear');
            return res.status(200).json({'error_code':200,'message':'Cart is Empty'});
        }
        else if(err) {
            console.log('error',err);
            return res.status(503).json({'error_code':503,'message':'try after some time'});
            
        }
        else {
            return res.status(200).json({"error_code":200,"message":"Not found"});
        }
    });




}


const addToCart = async (req, res, next) => {
    // console.log(req.body);
    console.log(req.body.bundle)
    var bundle = {'bundle':req.body.bundle};
    
    
    // var remainder = Math.floor(req.body.bundle.length%6)
    // var container_size = Math.floor((req.body.bundle.length-remainder)/6);
  
    // if(remainder>0 && container_size!==0){
    //     container_size+=1;
    // }
    
    // if(container_size>0){
    //     console.log(container_size);
    let updated_data = {
        'user_id': req.body.user_id,
        'bundle': req.body.bundle,
        'tax': req.body.tax,
        'shipping_cost': req.body.shipping_cost,
        'cart_total': req.body.cart_total
    };




 
    Cart.findOneAndUpdate({'user_id':req.body.user_id}, updated_data, {upsert:true}, function(err, doc){
        if (err)  {console.log(err)
           return  res.send(500, {'error_code':500, 'error': err });
        }
        return res.status(200).json({'error_code':200,'message':"succesfully saved"});
    });
    
    



}








const allItemInCart = async (req, res, next) => {
    console.log(req.query.id,'  ',req.query.page);
    per_page = 10;
    page = Math.max(0, req.query.page)
    Cart.find({
        'user_id': req.query.id
    }).limit(per_page).skip(page).exec(function (err, result) {
        if (err) throw new Error(err);
        else if (result.length === 0) {
            res.status(200).json({"error_code":200,"message":"Cart is Empty"});
        } else if (result.length !== 0) {
            res.status(200).json({"error_code":200,"message":"Cart is not Empty","data":result});
        }
    })


}








module.exports = {
    deleteAllItemFromCart,
    addToCart,
    allItemInCart,
   
}
