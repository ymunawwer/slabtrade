const material = require('../models/material');
const createMaterial = async(req,res,next)=>{
    var name
    console.log(req.body)
    if(typeof req.body.name!=='undefined'){
    name = req.body.name.toLowerCase()
    }
   let materialPromis =  material.createMaterial(name)
   materialPromis.then((result)=>{
    res.status(200).json({
        'error_code':200,
        'message':'Material Succesfully added'
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
}

const getAllMaterial = async(req,res,next)=>{
    
    try{
        var material_result = await material.find({})
        if(material_result.length!==0){
            res.status(200).json({
                'error_code':200,
                'message':'List of material',
                "data":material_result
            })
        }else if(material_result.length===0){
            res.status(200).json({
                'error_code':200,
                'message':'No material',
                
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

const removeMaterial = async(req,res,next)=>{
    material.deleteOne({'_id':req.query.id}).exec(function(err,result){
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':'Please try again.',
                'data':err
            })}else{

            res.status(200).json({
                'error_code':200,
                'message':'Remove Succesfully.',
                
            })
        }

    })
}

module.exports = {
    createMaterial,
    removeMaterial,
    getAllMaterial
}