var orderService =require('../../services/order');



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



module.exports ={
    fetchAllOrders
}