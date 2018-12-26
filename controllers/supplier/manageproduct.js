const Product = require('../../models/products');
const Order = require('../../models/order');
var mailService = require('../../services/mailService');
var mongoose = require('mongoose');


const addProduct = async (req,res,next)=>{
    console.log(req.body)
    let images=new Array();
   if(req.files){
    req.files.forEach(function(image){
            images.push({'path':image.location});
            
        });

        console.log(req.body.dimension);
        let product =  Product.addProduct(req.body.product_name,req.body.supplier_id,req.body.product_type,req.body.product_type_code,req.body.quality,req.body.price,req.body.color,req.body.width,req.body.height,req.body.unit,req.body.thickness,req.body.slab_weight,req.body.bundle_number,req.body.no_of_slabs,req.body.dimension,req.body.net_dimension,req.body.net_weight,images,req.body.product_description,req.body.bundle_description,req.body.inspection_report);
        product.then(function(result){
            res.status(200).send(result);
        }).catch(function(err){
            console.log(err)
            res.status(500).send("Bundle Upload Failed:\n"+err);
        })
          


    }else{
        res.status(422).json({
            'error_code':422,
            'message':"Please upload proper data."
        });

    }

}

const removeProduct = async(req,res,next)=>{
    Product.findOneAndDelete({'supplier_id':req.query.supplier_id,'bundle_number':req.query.bundle_number},(err,result)=>{
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':err})

        }
        res.status(200).json({
            'error_code':200,
            'message':result
        })

    })



}

//requ

const updateProduct = async(req,res,next)=>{
    console.log(req.body)
    let net_dimension = {
        'width':req.body.width || 0,
        'height':req.body.height || 0,
        'unit':req.body.unit || 0

    }
    var product_obj = {
        'product_name': req.body.product_name,
        'supplier_id': req.body.supplier_id,
        'bundle_number': req.body.bundle_number,
        'product_type': req.body.product_type,
        'product_type_code': req.body.product_type_code,
        'quality': req.body.quality,
        'price': req.body.price,
        'color': req.body.color,
        'net_dimension': net_dimension,
        'slab_weight': req.body.slab_weight,
        'bundle_number': req.body.bundle_number,
        'no_of_slabs': req.body.no_of_slabs,
        'dimension': req.body.dimension,
        'net_weight': req.body.net_weight,
        'product_description': req.body.product_description,
        'inspection_report': req.body.inspection_report
    };

    Product.findOneAndUpdate({'bundle_number':req.body.bundle_number},product_obj,function(err,result){
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':'Update Fail.please try again later.'

            })
            res.status(200).json({
                'error_code':200,
                'message':'Succesfully updated.',
                'data':doc

            })
        }

    })





}





const getAllProduct=async(req,res,next)=>{
    Product.find({'supplier_id':req.query.supplier_id},(err,result)=>{
        if(err){
            
            res.status(500).json({
                'error_code':500,
                'message':err})
        }
        res.status(200).json(result)
    })

}


const uploadShippingDetail=async(req,res,next)=>{
    console.log(req.body)
    let docs = new Array();
    if(req.files){
        req.files.forEach(function(file){
            
            docs.push({'path':file.location});
                
            });
        
     
        Order.updateOne({'_id':mongoose.Types.ObjectId(req.body._id)},{$set:{'shipping_doc':docs}},(err,result)=>{
           
            if(err){
                console.log(err)
                res.status(500).json({
                    'error_code':500,
                    'message':err
                })
            }
            else if(!err){
                console.log()
                if(result.nModified!==0){
                    //To is admin email
                    mailService.sendMailFunction('admin@slabtrade.com','Shiipment Doc uploaded','','<b>Hi</b><br>Ready for the shipment.<br><br><b>Thank You.</b>')
            res.status(200).json({
                'error_code':200,
                'message':'Updated Succesfully'})
            }
            else if(result.nModified===0){
                res.status(200).json({
                    'error_code':200,
                    'message':'Order id is not valid.'})
                }
            }
        
            
        })
    } 
    }





module.exports = {
    removeProduct,
    updateProduct,
    addProduct,
    getAllProduct,
    uploadShippingDetail
}