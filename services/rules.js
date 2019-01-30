const rules = require('../models/rules');

const create = async(req,res,next)=>{

    try{
        let rulesPromise = rules.createRule(req.body.bundle_type,req.body.thickness,req.body.no_of_slabs)
        rulesPromise.then((result)=>{
            res.status(200).json({
                'error_code':200,
                'message':'Rule Succesfully added.'
            })
        }).catch((err)=>{
            if(err){
                console.log(err)
                res.status(500).json({
                    'error_code':500,
                    'message':'Please try again.',
                    'data':err
                })
            }
        })

    }catch(err){
        res.status(422).json({
            'error_code':422,
            'message':'Please try again.',
            'data':err
        })

    }
}

const updateRules = async(req,res,next)=>{
    let data = {
        'bundle_type':req.body.bundle_type,
        'thickness':req.body.thickness,
        'no_of_slabs':req.body.no_of_slabs
        
    }
    rules.update({'_id':req.body.id},data).exec(function(err,res){
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':'Please try again.',
                'data':err
            })}else{
                res.status(200).json({
                    'error_code':200,
                    'message':'Succesfully updated.',})

            }

        
    })
}



const getAllRules = async(req,res,next)=>{
    
    try{
        var rules_result = await rules.find({})
        if(rules_result.length!==0){
            res.status(200).json({
                'error_code':200,
                'message':'List of rules',
                "data":rules_result
            })
        }else if(rules_result.length===0){
            res.status(200).json({
                'error_code':200,
                'message':'No rules',
                
            })
        }


    }catch(err){
        console.log(err)
        res.status(500).json({
            'error_code':500,
            'message':'Please try again.'
        })
    }


}

const removeRules = async(req,res,next)=>{
    rules.deleteOne({'_id':req.query.id}).exec(function(err,result){
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':'Please try again.',
                'data':err
            })}else{

            res.status(200).json({
                'error_code':200,
                'message':'Removed Succesfully.',
                
            })
        }

    })
}

module.exports = {
    createRule,
    getAllRules,
    removeRules,
    updateRules
}