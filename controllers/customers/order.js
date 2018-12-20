var orders = require('../../models/order');
var cart = require('../../models/cart');
var mongoose = require('mongoose');
var user = require('../../models/user');
var mail = require('../../services/mailService');

const checkOut = async (req, res, next) => {
    // console.log(req.body);

    var orderconfirm = {};
    let bundle = [
     
    ];
    try{
    console.log("checkout")
   await cart.findOne({
        'user_id': req.body.user_id
    }).exec(async function (err, doc) {
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

            console.log(doc.bundle[0].quantity);
            // var remainder = Math.floor(doc.bundle.length % 6)
            var remainder = Math.floor(doc.bundle.length % 6)
            // var container_size = Math.floor((doc.bundle.length - remainder) / 6);
            var container_size = Math.floor((doc.bundle.length - remainder) / 6);

            if (remainder > 0 && container_size !== 0) {
                container_size += 1;
            }

            if (container_size > 0) {
                //check for the payment and if it is 1000 aur 1001 proceed


                var i = 0;
                for (let items of doc.bundle) {
                    
                    var dimensionArray = [];
                    for (dimension of items.Dimension) {
                        
                        let dimension1 = {
                            'width': dimension.width,
                            'height': dimension.height,
                            'unit': dimension.unit
                        }
                        dimensionArray.push(dimension1);
                        i++;
                    }
                    //     let dimension = {'width':items.Dimension.width,'height':items.Dimension.height,'unit':items.Dimension.unit}
                    //     console.log(dimension);
                    bundle.push({
                        'bundle_id': items.bundle_id,
                        'dimension': dimension,
                        'quantity': items.quantity,
                        'price':items.price
                    });

                }

                
                



                orderconfirm = {
                    'user_id': doc.user_id,
                    'supplier_id': doc.supplier_id,
                    'name':req.body.name,
                    'cancel_status': doc.cancel_status,
                    'payment': req.body.payment,
                    'products': bundle,
                    'container_no': doc.container_no,
                    'price': doc.price,
                    'tax': req.body.tax,
                    'service': req.body.service,
                    'total': req.body.total
                };
                console.log(orderconfirm)
                order = await new orders(orderconfirm).save(function (err, result) {
                    if (err) {
                        res.status(500).json({
                            "error_code": 500,
                            "message": "Please try again later"
                        })
                    }
                   else{
                    cart.findOneAndDelete({
                        'user_id': req.body.user_id
                    }, (err, result) => {
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
                    }
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
