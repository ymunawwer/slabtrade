var orders = require('../../models/order');
var cart = require('../../models/cart');
var mongoose = require('mongoose');
var user = require('../../models/user');
var mail = require('../../services/mailService');
var _ = require('lodash');
var products = require('../../models/products');
const Json2csvParser = require('json2csv').Parser;

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
            var remainder = Math.floor(doc[0]['container'][0]['total_quantity'] % 7)
            console.log('remainder',remainder)
            // var container_size = Math.floor((doc.bundle.length - remainder) / 6);
            console.log(doc['total_quantity'])
            //old
            // var container_size = Math.floor((doc['total_quantity'] - remainder) / 6);
            var container_size = Math.floor((doc[0]['container'][0]['total_quantity'] - remainder) / 7);
            console.log('container_size',container_size)
            // if (remainder > 0 && container_size !== 0) {
            //     container_size += 1;
            // }

            if (JSON.parse(doc[0]['container'][0]['total_weight'])<57 ||remainder === 0 ) {

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
                order = await new orders(orderconfirm).save(async function (err, result) {
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
                        cart.update({},  { $pull: { container: { _id: mongoose.Types.ObjectId(req.body.container_id) } } },{ multi: true},async (err,result)=>{
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
                            var inspection_report = [];
                            bundle.forEach(async (el)=>{
                                console.log(el['bundle_id'])
                                products.find({'bundle_number':el['bundle_id']}).exec(async (err,result)=>{
                                    if(err){
                                        console.log(err)
                                    }
                                    var updated_inspection =result[0]['inspection_report']
                                    console.log(result)
                                    for (x in result[0]['inspection_report']){
                                        if(x<el['quantity']){
                                        inspection_report.push({'bundle_id':el['bundle_id'],'inspection_report':result[0]['inspection_report'][x]});
                                        try{
                                            let updated_inspection =result[0]['inspection_report'].filter(el=>{
                                                return el!==result[0]['inspection_report'][x]
                                            })
                                    products.update({'bundle_number':el['bundle_id']},{$pull:{'inspection_report':{$in:[result[0]['inspection_report'][x]]}}}).exec(function(err,result_ins){
                                        if(err){
                                            console.log(err)
                                        }else{
                                         
                                            console.log(result_ins)
                                        }
                                    })
                                        }catch(err){
                                            console.log(err)
                                        }
                                    }
                                    }
                                   
                                })
                                // inspection_report.push({'bundle_id':el['bundle_id'],'inspection_report':"pr['inspection_report']"});

                                console.log(el['quantity'])

                                const fields = ['bundle_id', 'inspection_report'];
            const json2csvParser = new Json2csvParser({
                fields,
                
                unwindBlank: true,
                flatten: false
            });
            // res.status(200).json({'status_code':200,
            //                 'data':result});
            setTimeout(async function(){
                const csv = json2csvParser.parse(inspection_report);
                console.log(csv)
                
                             
                    var attachments = [
                        {   // utf-8 string as an attachment
                            filename: 'IR.csv',
                            content: csv
                        }]
                        mail.sendMailFunction(result.email,'Order placed successfuly','','<b>Hi</b><br>Thank you for shopping wit us.<br><br><br><b>Thank You</b>',attachments);
                        let cart1 = await cart.find({'user_id':req.body.user_id});
                        if(cart1[0]['container'].length===0){
                            cart.findOneAndDelete({ 'user_id': req.body.user_id }).exec(function(err,response){
                                if(err){
                                    console.log(err)
                                }else{
                                console.log('No container left.')
                                }
                            })
                        }
            },1000)
         


                            })
                            console.log(inspection_report)
                           
                          

                        })
                    }   console.log(bundle)
                    bundle.forEach(async el=>{
                        console.log(el['bundle_id'])
                        let product = await products.update({'bundle_number':el['bundle_id']},{$inc:{'trendy':1}})
                    })
                    //clear cart if no item in container
   

                    //clear cart end
                    
                    
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
