var orderService =require('../../services/order');
var products =  require('../../models/products');
var Order = require('../../models/order');
var mongoose = require('mongoose');
var mailService = require('../../services/mailService')



const fetchAllOrders = async (req,res,next)=>{
    console.log('hello');
     await orderService.getOrdrerList(req,res,next);
    
    
    
}


const fetchAllPendingOrders = async (req,res,next)=>{
    console.log('hello');
     await orderService.getOrdrerList(req,res,next);
    
    
}


const fetchAllApprovedOrders = async (req,res,next)=>{
    console.log('hello');
     await orderService.getOrdrerList(req,res,next);
    
    
}

const getProductDetail = async (req,res,next)=>{
  await products.find({'bundle_number':req.query.bundle_number}).exec((err,resul)=>{

      if(err){
          res.status(500).json({
              'error_code':500,
              'message':'please try again later'
          })
      }else{
        res.status(200).json({
            'error_code':200,
            'data':resul

        })
    }
  })
   

}

const uploadWireDetail=async(req,res,next)=>{
    console.log(req.body)
    let docs = new Array();
    if(req.files){
        req.files.forEach(function(file){
            
            docs.push({'path':file.location});
                
            });
        
     
        Order.updateOne({'_id':mongoose.Types.ObjectId(req.query.id)},{$set:{'wired_doc':docs}},(err,result)=>{
           
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



module.exports ={
    fetchAllOrders,fetchAllPendingOrders,fetchAllApprovedOrders,getProductDetail,uploadWireDetail
}