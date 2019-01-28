const Product = require('../../models/products');
const Order = require('../../models/order');
const deals = require('../../models/deals');
var mailService = require('../../services/mailService');
var mongoose = require('mongoose');
var User = require('../../models/user');


const addProduct = async (req,res,next)=>{
    console.log(req.body)
    let images=new Array();
   if(req.files){

  
    // deals = await new this(deals).save();
    if(typeof req.body.isoffer!=='undefined' && (req.body.isoffer!=='0'||JSON.parse(req.body.isoffer)!==0)){
        var deal = {
            'first_name':req.body.first_name,

            'bundle_number':req.body.bundle_number,
    
            'offer_value':typeof req.body.offer_value ==='string'?JSON.parse(req.body.offer_value):req.body.offer_value,
    
            'start_date':req.body.start_date,
            
            'end_date':req.body.end_date,
    
            'product_type':req.body.product_type,

            'supplier_id':req.body.supplier_id
    
        }
        //check for error pending
        deal = await deals.insertMany(deal)
    }
   

    



    req.files.forEach(function(image){
            images.push({'path':image.location});
            
        });
        if(typeof req.body.isoffer!=='undefined' && JSON.parse(req.body.isoffer)!==0){
        if(typeof req.body.offer_value === 'string'){
            offer_value = JSON.parse(req.body.offer_value)

        }else{
            offer_value = req.body.offer_value
        }
        if(typeof req.body.isoffer === 'string'){
            isoffer = JSON.parse(req.body.isoffer)

        }else{
            isoffer = req.body.isoffer
        }
    }else{
        offer_value = req.body.offer_value
        isoffer = req.body.isoffer

    }
        console.log(req.body.dimension);
        var verification;
        let supplier_detail = await User.find({'_id':mongoose.Types.ObjectId(req.body.supplier_id)});
        if(supplier_detail[0]['verification_mode']==='auto' || typeof supplier_detail[0]['verification_mode']==='undefined'){
            verification = 1
        }else if(supplier_detail[0]['verification_mode']==='manual'){
            verification = 0
        }
        console.log(verification);
        let product =  Product.addProduct(req.body.product_name,req.body.supplier_id,req.body.product_type,req.body.product_type_code,req.body.quality,req.body.price,req.body.color,req.body.width,req.body.height,req.body.unit,req.body.thickness,req.body.slab_weight,req.body.bundle_number,req.body.no_of_slabs,req.body.dimension,req.body.net_dimension,req.body.net_weight,images,req.body.product_description,req.body.bundle_description,req.body.inspection_report,offer_value,req.body.start_date,req.body.end_date,isoffer,req.body.preference,verification);
        product.then(function(result){
            res.status(200).send(result);
        }).catch(function(err){
            console.log(err)
            res.status(500).json({"message":"Bundle Upload Failed:\n","erro_code":500,"data":err});
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
    var images = req.body.images
    console.log('images',typeof req.body.images)
    var uploaded_images = req.files
    var change_image_index = [];
    var remove_image_index = [];
    console.log('files',req.files)
    if(typeof req.body.images !=='undefined'){
        images = images.split(",")
        var i =0;
        images.forEach((el)=>{
            if(el!=='[object Object]' && el!=='' || el==='[object File]'){
                change_image_index.push(i)
                
            }else if(el===''){
                remove_image_index.push(i)
            }
            i++
        })

    }
   
        console.log('images',change_image_index,images)
    
    
    let net_dimension = {
        'width':req.body.width || 0,
        'height':req.body.height || 0,
        'unit':req.body.unit || 0

    }
    //product detail 
    let product_det = await Product.find({'bundle_number': req.body.bundle_number})
    // console.log(req.body.bundle_number)
    // console.log(product_det[0])
    var p_image_arr = product_det[0]['images']
    if(typeof product_det[0]!=='undefined' && typeof product_det[0]['images']!=='undefined'){
       var j = 0;
        change_image_index.forEach((el)=>{
            
            p_image_arr[el] = {'path':uploaded_images[j]['location']}
            j++
            
        })
        var k = 0
        remove_image_index.forEach((el)=>{
            if(el===0){
                p_image_arr[el] = {'path':'https://via.placeholder.com/500x500?text=Select+Preview+Image'}
            }else{
            p_image_arr[el] = {'path':'https://via.placeholder.com/500x500?text=Select+Other+Image'}
            }
            j++
            
        })
       
        }
        console.log('new_image arr',p_image_arr)
        p_image_arr = p_image_arr.filter(value => Object.keys(value).length !== 0);
        console.log('new_image arr',p_image_arr)
    

    //end req.body.bundle_number
        // req.body.offer_value!=='null'?req.body.offer_value!==0?1:0:0,
        var is_offer_value;
        if(req.body.offer_value!=='null' && req.body.offer_value!=='0'){
            is_offer_value =1
        }else if(req.body.offer_value==='0' || req.body.offer_value==='null'){
            is_offer_value = 0
        }
        console.log('dimension type',typeof req.body.dimension)

    var product_obj = {
        'product_name': req.body.product_name,
        'supplier_id': req.body.supplier_id,
        'bundle_number': req.body.bundle_number,
        'product_type': req.body.product_type.toLowerCase(),
        'product_type_code': req.body.product_type_code,
        'quality': req.body.quality,
        'price': req.body.price,
        'color': req.body.color,
        'images':p_image_arr,
        'net_dimension': net_dimension,
        'slab_weight': req.body.slab_weight,
        'bundle_number': req.body.bundle_number,
        'no_of_slabs': req.body.no_of_slabs,
        'dimension': typeof req.body.dimension!=='object'?JSON.parse(req.body.dimension):req.body.dimension,
        'net_weight': req.body.net_weight,
        'Bundle_description':req.body.Bundle_description,
        'product_description': req.body.product_description,
        'inspection_report': req.body.inspection_report,
        'offer_value':req.body.offer_value!=='null'?req.body.offer_value:0,
        'start_date':req.body.start_date,
        'end_date':req.body.end_date,
        'isoffer':is_offer_value,
        'preference':req.body.slab_preference
    };

    Product.findOneAndUpdate({'bundle_number':req.body.bundle_number},product_obj,function(err,result){
        if(err){
            console.log(err)
            res.status(500).json({
                'error_code':500,
                'message':'Update Fail.please try again later.'

            })
            }else{
            res.status(200).json({
                'error_code':200,
                'message':'Succesfully updated.',
                'data':result

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

const getProduct = async(req,res,next)=>{
    await Product.findById(req.params.id).exec(function(err,data){
        if(err){
            res.status(500).json({
                "error_code":500,
                "data":"Please check product ID"
            })

        } else if(data){
            res.status(200).json({
                "error_code":200,
                "data":data
            })
    
        }else{
            res.status(200).json({
                "error_code":200,
                "data":"No product"
            })
        }
    
    })

   
}
    








module.exports = {
    removeProduct,
    updateProduct,
    addProduct,
    getAllProduct,
    uploadShippingDetail,
    getProduct

}