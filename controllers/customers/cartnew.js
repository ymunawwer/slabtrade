const Cart = require('../../models/cartnew');

const addToCart = async(req,res,next)=>{
    var container_number = 1
    let quantity = req.body['total_quantity']
    let obj = {
        'user_id':req.body.id,
        'container':req.body.bundle

    }

    Cart.findOneAndUpdate({'user_id':req.body.user_id}, obj, {upsert:true}, function(err, doc){
       
        if (err)  {console.log(err)
           return  res.send(500, {'error_code':500, 'error': err });
        }
        return res.status(200).json({'error_code':200,'message':"succesfully saved"});
    });
    

}

module.exports = {
    addToCart
}
