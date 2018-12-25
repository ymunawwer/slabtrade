var orderService =require('../../services/order');
var products =  require('../../models/products');



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



module.exports ={
    fetchAllOrders,fetchAllPendingOrders,fetchAllApprovedOrders,getProductDetail
}