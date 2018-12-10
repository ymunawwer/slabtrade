const port = require('../models/port');

const getAllPort = async (req,res,next)=>{

    port.find({}, function(err, doc){
        if (err) return res.status(500).json({'error_code':500 ,'error': err });
        return res.status(200).json({'error_code':200,'message':'list of all ports','data':doc});
    });



}


const getPortDetail = async (req,res,next)=>{

    port.find({'port_id':req.query.port_id}, function(err, doc){
        if (err) return res.status(500).json({'error_code':500 ,'error': err });
        return res.status(200).json({'error_code':200,'message':'ports details','data':doc});
    });



}

module.exports = {
    getAllPort,
    getPortDetail
}