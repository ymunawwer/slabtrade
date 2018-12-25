const port = require('../../models/port');


const addPort = async (req,res,next)=>{
    var portpromise = port.addPort(req.body.port_name,req.body.country,req.body.shipping_cost,req.body.port_cost,req.body.tax_percentage,req.body.facilities_cost);
    portpromise.then((result)=>{
        res.status(200).json({
            'error_code':200,
            'message':'Port Succesfully added'
        })
    }).catch((err)=>{
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':'Please try again.'
            })
        }
    })
}


const updatePort = async (req,res,next)=>{

    
    port.updatePort(req.body.port_id,req.body.port_name,req.body.country,req.body.shipping_cost,req.body.port_cost,req.body.tax_percentage,res);




}

const removePort = async (req,res,next)=>{

   
    port.removePort(req.body.port_id,res)
   


}



module.exports = {
   addPort,updatePort,removePort
}
