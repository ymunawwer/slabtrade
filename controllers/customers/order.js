var orders = require('../../models/order');
var cart = require('../../models/cart');
var mongoose = require('mongoose');
var user = require('../../models/user');
var mail = require('../../services/mailService');
var _ = require('lodash');
var products = require('../../models/products');

const checkOut = async (req, res, next) => {
    console.log('checkout',req.body);
    var map = new Map();
    
    var orderconfirm = {};
    let bundle = [
     
    ];
    try{
    console.log("checkout")
    // await cart.findOne({
    //     'user_id': req.body.user_id
    // }).exec(async function (err,doc)


  cart.aggregate([
        {$match: {'container._id': mongoose.Types.ObjectId(req.body.container_id)}},
        {$project: {
            _id:0,
            
               container: {$filter: {
                   input: '$container',
                   as: 'container',
                   cond: {$eq: ['$$container._id', mongoose.Types.ObjectId(req.body.container_id)]}
               }},
              
           }}
        ]).exec(async function(err, doc) {
        if (err) {
            res.status(500).json({
                'error_code': 500,
                'message': err
            });
        }
        if (doc === null) {

            res.status(200).json({
                'error_code': 200,
                'message': 'Please add item to your cart.'
            });

        } else if (doc !== null) {
            // doc['bundle'].forEach(element => {
            //     sup = JSON.stringify(element['supplier_id'])
                
            //     console.log("element",map.has(sup))
                
            //     if(map.has(sup)){
                    
            //     map.set(sup,map.get(sup)+element['quantity'])
            
            //     console.log(element['supplier_id'])
            //     }else{
            //         map.set(sup,element['quantity'])
                    

            //     }
            //     console.log("map",map);
            
                
            // });
            // bool = true;
            // iscontainerfull = true
            // map.forEach((value,key)=>{
            //     if(value%6 === 0){
                    
            //         console.log("Container is full.thank you")
            //     }else if(value%6 !== 0){
                    
            //         if(bool){
            //             res.status(200).json({
            //                 "error_code":200,
            //                 "message":"PLease add more Item.",
            //                 "data":key
            //             })
            //             bool = false
            //             iscontainerfull = false
            //         }
                    
                    

                    
            //     }
            // })

          

            console.log('doc',JSON.stringify(doc[0]));
            // var remainder = Math.floor(doc.bundle.length % 6)
           //old
            // var remainder = Math.floor(doc['total_quantity'] % 6)
            var remainder = Math.floor(doc[0]['container'][0]['total_quantity'] % 6)
            console.log('remainder',remainder)
            // var container_size = Math.floor((doc.bundle.length - remainder) / 6);
            console.log(doc['total_quantity'])
            //old
            // var container_size = Math.floor((doc['total_quantity'] - remainder) / 6);
            var container_size = Math.floor((doc[0]['container'][0]['total_quantity'] - remainder) / 6);
            console.log('container_size',container_size)
            // if (remainder > 0 && container_size !== 0) {
            //     container_size += 1;
            // }

            if (remainder === 0 ) {

                //check for the payment and if it is 1000 aur 1001 proceed


                var i = 0;
                //for (let items of doc.bundle) {
                    for (let items of doc[0]['container'][0]['bundle']) {  
                    var dimensionArray = [];
                    for (dimension of items.Dimension) {
                        
                        let dimension1 = {
                            'width': dimension.width,
                            'height': dimension.height,
                            'unit': dimension.unit,
                            'thickness':items.thickness
                        }
                        dimensionArray.push(dimension1);
                        i++;
                    }
                    //     let dimension = {'width':items.Dimension.width,'height':items.Dimension.height,'unit':items.Dimension.unit}
                    //     console.log(dimension);
                    bundle.push({
                        'supplier_id':items.supplier_id,
                        'bundle_id': items.bundle_id,
                        'dimension': dimensionArray[0],
                        'quantity': items.quantity,
                        'price':items.price
                    });

                }

                
                



                orderconfirm = {
                    'user_id': req.body.user_id,
                    
                    'name':req.body.name,
                    'cancel_status': "Pending",
                    'payment': req.body.payment,
                    'products': bundle,
                    'container_no': doc.container_no,
                    
                    'tax': req.body.tax,
                    'service': req.body.service,
                    'total': req.body.total,
                    'port':req.body.port,
                    'unload':req.body.unload,
                    'shipping_Addr':req.body.shipping_addr
                };
                console.log(orderconfirm)
                order = await new orders(orderconfirm).save(function (err, result) {
                    if (err) {
                        console.log(err)
                        res.status(500).json({
                            "error_code": 500,
                            "message": "Please try again later"
                        })
                    }
                   else{
                    // cart.findOneAndDelete({
                    //     'user_id': req.body.user_id
                    // }, (err, result) => {
                        cart.update({},  { $pull: { container: { _id: mongoose.Types.ObjectId(req.body.container_id) } } },{ multi: true},(err,result)=>{
                            console.log('delete',result)
                        if (err) {
                            console.log(err)
                            res.status(500).json({
                                "error_code": 500,
                                "message": "Please try again later"
                            })
                        }
                        else {
                        user.findById(req.body.user_id,function(err,result){
                            if(err){
                                res.status(500).json({
                                    "error_code": 500,
                                    "message": "Please try again later"
                                })
                            
                            }
                            mail.sendMailFunction(result.email,'Order placed successfuly','','<b>Hi</b><br>Thank you for shopping wit us.<br><br><br><b>Thank You</b>');

                        })
                    }   console.log(bundle)
                    bundle.forEach(async el=>{
                        console.log(el['bundle_id'])
                        let product = await products.update({'bundle_number':el['bundle_id']},{$inc:{'trendy':1}})
                    })
                    
                    
                    res.json({
                            'error_code': 200,
                            'message': 'Order Placed Succesfully'
                        });

                    })
                }

                });
                //if payment fail 2000 and more 2001 for insuffiecient fund prompt user with error message
            }else {
                res.json({
                    'error_code': 200,
                    'message': 'Container is not full'
                });

            }
        }

    })
    }catch(err){
        console.log(err)

    }




}

module.exports = {
    checkOut
}
