const Cart = require('../../models/cart');
var Order = require('../../models/order');
var mongoose = require('mongoose');
const User = require('../../models/user');
var Product = require('../../models/products')


const deleteAllItemFromCart = async (req, res, next) => {
    console.log("delete",req.body);
    
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

const removeContainer = async(req,res,next)=>{

    Cart.aggregate([
        {$match: {'container._id': mongoose.Types.ObjectId(req.query.id)}},
        {$project: {
            _id:0,
            
               container: {$filter: {
                   input: '$container',
                   as: 'container',
                   cond: {$eq: ['$$container._id', mongoose.Types.ObjectId(req.query.id)]}
               }},
              
           }}
        ]).exec(function(err,cart_item_result){
            
if(err){

}else{



    Cart.update({},  { $pull: { container: { _id: mongoose.Types.ObjectId(req.query.id) } } },{ multi: true},async (err,result)=>{
        if (result) {
            console.log(result)
            let cart = await Cart.find({'user_id':req.query.user_id});
            console.log(req.query.user_id,cart,cart[0]['container'].length)
            if(cart[0]['container'].length===0){
                Cart.findOneAndDelete({ 'user_id': req.query.user_id }).exec(function(){
                    console.log('No container left.')
                })
            }
            cart_item_result[0]['container'][0]['bundle'].forEach(function(ress){
                Product.findOneAndUpdate({'bundle_number':ress['bundle_id']},{$inc:{no_of_slabs:ress['quantity']}}).exec(function(err,res){
if(err){

}
                })
            })
            console.log('container item',cart_item_result[0]['container'])
            
            console.log('cart is clear');
            return res.status(200).json({'error_code':200,'message':'Container is removed.'});
        }
        else if(err) {
            console.log('error',err);
            return res.status(503).json({'error_code':503,'message':'try after some time'});
            
        }
        else {
            return res.status(200).json({"error_code":200,"message":"Container Not found"});
        }
    
})}
        })
}
 


const itemRemove = async (req,res,next) =>{
    console.log(req.body);
    Cart.updateOne({'user_id':mongoose.Types.ObjectId(req.body.id)},{$set:{"cart_total":req.body.cart_total,"tax":req.body.tax,"total_amount":req.body.total_amount,"total_quantity":req.body.total_quantity}}, function(err, doc){
       
        if (err)  {console.log(err)
           return  res.send(500, {'error_code':500, 'error': err });
        }
        return res.status(200).json({'error_code':200,'message':"succesfully saved"});
    });

}


const addToCart = async (req, res, next) => {
    console.log('bundle',req.body);
    
    // var bundle = req.body.bundle;
    
    var city
    city =await User.find({'_id':req.body.container[req.body.container.length-1]['bundle'][req.body.container[req.body.container.length-1].bundle.length-1]['supplier_id']})
    console.log(city)
    req.body.container[req.body.container.length-1]['city'] = city[0]['city']
    if(req.body.container[req.body.container.length-1]['total_quantity']===6){
        req.body.container[req.body.container.length-1]['container_full'] = 1;
        

    }

    
    
    
    // var remainder = Math.floor(req.body.bundle.length%6)
    // var container_size = Math.floor((req.body.bundle.length-remainder)/6);
    // bundle['container_no'] = container_size
    // if(remainder>0 && container_size!==0){
    //     container_size+=1;
        
    // }
    
    // if(container_size>0){
    //     console.log(container_size);
    let updated_data = {
        // "supplier_id":req.body.supplier_id,
        'user_id': req.body.user_id,
        'container':req.body.container
        // {
        // 'bundle': req.body.container,
        // 'tax': req.body.tax,
        // 'total_amount':req.body.total_amount,
        // 'shipping_cost': req.body.shipping_cost,
        // 'cart_total': req.body.cart_total,
        // 'total_quantity':req.body.total_quantity
        // }
    };
    console.log(req.body.container[req.body.container.length-1]['_id']);
    await Cart.aggregate([
        {$match: {'container._id': mongoose.Types.ObjectId(req.body.container[req.body.container.length-1]['_id'])}},
        {$project: {
            _id:0,
            
               container: {$filter: {
                   input: '$container',
                   as: 'container',
                   cond: {$eq: ['$$container._id', mongoose.Types.ObjectId(req.body.container[req.body.container.length-1]['_id'])]}
               }},
              
           }}
        ]).exec(async function(err,result){
            console.log("last container",result)
    // Cart.find({'user_id':mongoose.Types.ObjectId(req.body.user_id)}).exec(async function(err,result){
        // console.log("length",res[0]['bundle'][res[0]['bundle'].length-1])
        // console.log("supplier id",req.body['bundle'][req.body['bundle'].length-1]['supplier_id']!==JSON.stringify(result[0]['bundle'][result[0]['bundle'].length-1]['supplier_id']).replace(/"/g,""));
        if(result.length!==0){
    //    newly_added_item_supplier_city = await User.find({'_id':req.body['container'][0][req.body['bundle'].length-1]['supplier_id']})
       previously_added_item_supplier_city =await User.find({'_id':result[0]['container'][0]['bundle'][result[0]['container'][0]['bundle'].length-1]['supplier_id']})
       console.log("city",city[0]['city'],previously_added_item_supplier_city[0]['city'])
    //     if(req.body['bundle'][req.body['bundle'].length-1]['supplier_id']===JSON.stringify(result[0]['bundle'][result[0]['bundle'].length-1]['supplier_id']).replace(/"/g,"")){

    //  console.log('city',req.body['bundle'][req.body['bundle'].length-1]['supplier_id'])    
// newly_added_item_supplier_city[0]['city'].toLowerCase() === previously_added_item_supplier_city[0]['city'].toLowerCase()
    
if(city[0]['city']===previously_added_item_supplier_city[0]['city']){
    console.log(result)
    

 
    Cart.findOneAndUpdate({'user_id':req.body.user_id}, updated_data, {upsert:true}, function(err, doc){
       
        if (err)  {console.log(err)
           return  res.send(500, {'error_code':500, 'error': err });
        }
        console.log(req.body.container[req.body.container.length-1]['bundle'][req.body.container[req.body.container.length-1].bundle.length-1]['quantity'])
        console.log(req.body.container[req.body.container.length-1]['bundle'][req.body.container[req.body.container.length-1].bundle.length-1]['bundle_id'])
        Product.findOneAndUpdate({'bundle_number':req.body.container[req.body.container.length-1]['bundle'][req.body.container[req.body.container.length-1].bundle.length-1]['bundle_id']},{$inc:{no_of_slabs:-req.body.container[req.body.container.length-1]['bundle'][req.body.container[req.body.container.length-1].bundle.length-1]['quantity']}}).exec(function(err,res){
            if(err){
                console.log(err)
            }else{
                console.log(result)
            }
        })
        //removing wishlist

        Product.findOneAndUpdate({'bundle_number':req.body.container[req.body.container.length-1]['bundle'][req.body.container[req.body.container.length-1].bundle.length-1]['bundle_id']},{$pull:{'wishlist':mongoose.Types.ObjectId(req.body.user_id)}}).exec(function(err,result){
            if(err){
               console.log(err)
            }
            console.log("success")
                })


        //end wishlist code

        console.log('body',req.body.container[req.body.container.length-1]['bundle'][req.body.container[req.body.container.length-1].bundle.length-1])
        return res.status(200).json({'error_code':200,'message':"succesfully saved"});
    });
}
// 
// else if( req.body['bundle'][req.body['bundle'].length-1]['supplier_id']!==JSON.stringify(result[0]['bundle'][result[0]['bundle'].length-1]['supplier_id']).replace(/"/g,"") ){
    else if(city[0]['city']!==previously_added_item_supplier_city[0]['city']){
        console.log('body',req.body.container[req.body.container.length-1]['bundle'][req.body.container[req.body.container.length-1].bundle.length-1])
        
       
   
        if(result[0]['container'][0]['total_quantity']%6!==0){
        var supplier_id = []
        await User.find({'city':previously_added_item_supplier_city[0]['city']}).exec((err,result)=>{
            result.forEach(el=>{
                supplier_id.push(new mongoose.Types.ObjectId(el['_id']));
                console.log('el',el['_id'])
            })
            
            // console.log('res',res)

        })
        setTimeout(async function(){
        console.log('id',supplier_id)
        let product =await Product.find({'supplier_id':{$in:supplier_id}})
        console.log("prod",product)
        res.status(200).json({"error_code":200,"Message":"Please add more item to the container.","data":product})
        },5000)
    }else{
        Cart.findOneAndUpdate({'user_id':req.body.user_id}, updated_data, {upsert:true}, function(err, doc){
       
            if (err)  {console.log(err)
               return  res.send(500, {'error_code':500, 'error': err });
            }

            Product.findOneAndUpdate({'bundle_number':req.body.container[req.body.container.length-1]['bundle'][req.body.container[req.body.container.length-1].bundle.length-1]['bundle_id']},{$inc:{no_of_slabs:-req.body.container[req.body.container.length-1]['bundle'][req.body.container[req.body.container.length-1].bundle.length-1]['quantity']}}).exec(function(err,res){
                if(err){
                    console.log(err)
                }else{
                    console.log(result)
                }
            })

             //removing wishlist

        Product.findOneAndUpdate({'bundle_number':req.body.container[req.body.container.length-1]['bundle'][req.body.container[req.body.container.length-1].bundle.length-1]['bundle_id']},{$pull:{'wishlist':mongoose.Types.ObjectId(req.body.user_id)}}).exec(function(err,result){
            if(err){
               console.log(err)
            }
            console.log("success")
                })


        //end wishlist code

            return res.status(200).json({'error_code':200,'message':"succesfully saved"});
        });

    }
  

}}else{
    Cart.findOneAndUpdate({'user_id':req.body.user_id}, updated_data, {upsert:true}, function(err, doc){
       
        if (err)  {console.log(err)
           return  res.send(500, {'error_code':500, 'error': err });
        }

        Product.findOneAndUpdate({'bundle_number':req.body.container[req.body.container.length-1]['bundle'][req.body.container[req.body.container.length-1].bundle.length-1]['bundle_id']},{$inc:{no_of_slabs:-req.body.container[req.body.container.length-1]['bundle'][req.body.container[req.body.container.length-1].bundle.length-1]['quantity']}}).exec(function(err,res){
            if(err){
                console.log(err)
            }else{
                console.log(result)
            }
        })
 //removing wishlist

 Product.findOneAndUpdate({'bundle_number':req.body.container[req.body.container.length-1]['bundle'][req.body.container[req.body.container.length-1].bundle.length-1]['bundle_id']},{$pull:{'wishlist':mongoose.Types.ObjectId(req.body.user_id)}}).exec(function(err,result){
    if(err){
       console.log(err)
    }
    console.log("success")
        })


//end wishlist code

        setTimeout(() => {
            return res.status(200).json({'error_code':200,'message':"succesfully saved"});  
        }, 1000);
       
    });
}
})
    



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

const removeBundle = async (req,res,next)=>{


    Cart.aggregate([
        {$match: {'container.bundle._id': mongoose.Types.ObjectId(req.query.id)}},
        {$project: {
            _id:0,
            
               container: {$filter: {
                   input: '$container',
                   as: 'container',
                   cond: {$eq: ['$$container.bundle._id', mongoose.Types.ObjectId(req.query.id)]}
               }},
              
           }}
        ]).exec(function(err,cart_item_result){
            
if(err){

}else{



    Cart.update({},  { $pull: { container: {bundle:{_id: req.query.id} }}},async (err,result)=>{
        if (result) {
            console.log(result)
            let cart = await Cart.find({'user_id':req.query.user_id});
            // console.log(req.query.user_id,cart,cart[0]['container'].length)
            // if(cart[0]['container'].length===0){
            //     Cart.findOneAndDelete({ 'user_id': req.query.user_id }).exec(function(){
            //         console.log('No container left.')
            //     })
            // }
//             cart_item_result[0]['container'][0]['bundle'].forEach(function(ress){
//                 Product.findOneAndUpdate({'bundle_number':ress['bundle_id']},{$inc:{no_of_slabs:ress['quantity']}}).exec(function(err,res){
// if(err){

// }
//                 })
//             })
            // console.log('container item',cart_item_result[0]['container'])
            
            console.log('cart is clear');
            return res.status(200).json({'error_code':200,'message':'Container is removed.'});
        }
        else if(err) {
            console.log('error',err);
            return res.status(503).json({'error_code':503,'message':'try after some time'});
            
        }
        else {
            return res.status(200).json({"error_code":200,"message":"Container Not found"});
        }
    
})}
        })

        
    
    
}



const getCartItemByContainerId = function(req,res,next){
  console.log(req.query.id)
    Cart.aggregate([
        {$match: {'container._id': mongoose.Types.ObjectId(req.query.id)}},
        {$project: {
            _id:0,
            
               container: {$filter: {
                   input: '$container',
                   as: 'container',
                   cond: {$eq: ['$$container._id', mongoose.Types.ObjectId(req.query.id)]}
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








module.exports = {
    deleteAllItemFromCart,
    addToCart,
    allItemInCart,removeBundle,
    itemRemove,
    getCartItemByContainerId,
    removeContainer
   
}
