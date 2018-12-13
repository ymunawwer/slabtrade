const user = require('../../models/user');

const supplierCount = async (req,res,next)=>{
    supplier_count =0;
    customer_count = 0;
    user.find({'roles':'supplier'}).count(function(err,sc){
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':'Please try again'
            })}
      
        
        
    

    user.find({'roles':'customer'}).count(function(err,cc){
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':'Please try again'
            })
        }
        if(cc!==null){
            res.status(200).json({
                'error_code':200,
                'data':{'supplier_count':sc,
                "customer_count":cc
            }
            })
        }else{
        
            res.status(200).json({
                'error_code':204,
                'message':'no customer register'
            })
        }
        
    })
})
}


const customerCount = async (req,res,next)=>{
    user.find({'roles':'customer'}).count(function(err,no){
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':'Please try again'
            })
        }
        if(no!==null){
            res.status(200).json({
                'error_code':200,
                'data':no
            })
        }else{
        
            res.status(200).json({
                'error_code':204,
                'message':'no customer register'
            })
        }
        
    })
}



module.exports = {
    supplierCount,
    customerCount
}