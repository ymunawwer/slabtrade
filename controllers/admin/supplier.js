
var User = require('../../models/user');
var Product = require('../../models/products');
var mongoose = require('mongoose')
const setMode = async(req,res,next)=>{
    if(typeof req.query.email !=='undefined'){
    User.find({'email':req.query.email}).exec(function(err,result){
        if(typeof result[0]['verification_mode'] !== 'undefined'){
        if(result[0]['verification_mode']==='auto'){
            User.findOneAndUpdate({'email':req.query.email},{$set:{'verification_mode':'manual'}}).exec(function(err,result){
                if(err){
                    console.log(err)
                }
                console.log(result)
                res.status(200).json({'error_code':200,"message":"Mode is change to manual."})
            })

        }
       else if(result[0]['verification_mode']==='manual'){
            User.findOneAndUpdate({'email':req.query.email},{$set:{'verification_mode':'auto'}}).exec(function(err,result){
                if(err){
                    res.status(500).json({'error_code':500,"message":"Please try again."})
                }
                console.log(result)
                res.status(200).json({'error_code':200,"message":"Mode is change to auto."})
            })

        }
    }else{
        User.findOneAndUpdate({'email':req.query.email},{$set:{'verification_mode':req.query.mode}}).exec(function(err,result){
            if(err){
                console.log(err)
                res.status(500).json({'error_code':500,"message":"Please try again."})
            }
            console.log(result)
            res.status(200).json({'error_code':200,"message":"Mode is change to "+req.query.mode+"."})

        })
    }
    })
}
 
}

const getProductBySupplierId = async(req,res,next)=>{

    Product.find({'supplier_id':req.query.supplier_id}).exec(function(err,result){
        if(err){
            res.status(500).json({'error_code':500,'message':'Please try again later.'})
        }else{
            res.status(200).json({'error_code':200,'message':'List of Products belong to the Supplier.','data':result})
        }
    })

}

const setProductVerification = async(req,res,next)=>{
    console.log(typeof req.query.verification)
try{
    Product.findOneAndUpdate({'_id':req.query.id},{$set:{'verification':req.query.verification}}).exec(function(err,result){
        if(err){
            res.status(500).json({'error_code':500,'message':'Please try again later.'})
        }else{
            if(req.query.verification==='1'){
                res.status(200).json({'error_code':200,'message':'Bundle is verified.'})
            }else if(req.query.verification==='0'){
            res.status(200).json({'error_code':200,'message':'Bundle is not verified.'})
            }
        }
    })
}catch(err){
    res.status(500).json({'error_code':500,'message':'Please try again later.','data':err})
}

}



module.exports = {
    setMode,
    getProductBySupplierId,
    setProductVerification
}