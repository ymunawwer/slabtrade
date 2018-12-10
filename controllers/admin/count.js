const user = require('../../models/user');

const supplierCount = async (req,res,next)=>{
    
    user.find({'roles':'supplier'}).count(function(err,no){
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':'Please try again'
            })}
            if(no!==null){
            res.status(200).json({
                'error_code':200,
                'data':no
            })
        }else{
        
            res.status(200).json({
                'error_code':204,
                'message':'no supplier register'
            })
        }
        
        
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