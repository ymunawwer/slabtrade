var Order = require('../../models/order');
var Port = require('../../models/port');

// all query parameter
// possible combination are:
    // date,status,region,
    // DS:DATE and STATUS
    // DR:DATE and REGION
    // SR:STATUS and REGION
    // DSR:DATE,STATUS and REGION
//date format : yyyy,mm,dd


const filter_order = async (req,res,next)=>{
    if(req.query.type === 'date'){
        console.log(req.query.start)
        let order = await Order.find( {"created_at": {"$gte": new Date(req.query.start), "$lte": new Date(req.query.end)}});
        res.status(200).json({'error_code':200,
                              'message':'Order Filter Based on date',
                            'data':order  })

    }else if(req.query.type === 'status'){
        let order = await Order.find({'cancel_status':req.query.status});
        res.status(200).json({'error_code':200,
                              'message':'Order Filter Based on Status',
                            'data':order  })

        
    }else if(req.query.type === 'region'){
        
            let order = await Order.find({'port':req.query.port});
            res.status(200).json({'error_code':200,
                                  'message':'Order Filter Based on Region',
                                'data':order  })

        }else if(req.query.type === 'DS'){
        
            let order = await Order.find({"created_at": {"$gte": new Date(req.query.start), "$lte": new Date(req.query.end)},'cancel_status':req.query.status});
            res.status(200).json({'error_code':200,
                                  'message':'Order Filter Based on Date and status',
                                'data':order  })

        }else if(req.query.type === 'DR'){
        
            let order = await Order.find({"created_at": {"$gte": new Date(req.query.start), "$lte": new Date(req.query.end)},'port':req.query.port});
            res.status(200).json({'error_code':200,
                                  'message':'Order Filter Based on Region and date',
                                'data':order  })

        }else if(req.query.type === 'SR'){
        
            let order = await Order.find({'port':req.query.port,'cancel_status':req.query.status});
            res.status(200).json({'error_code':200,
                                  'message':'Order Filter Based on Region and status',
                                'data':order  })

        }else if(req.query.type === 'DSR'){
        
            let order = await Order.find({"created_at": {"$gte": new Date(req.query.start), "$lte": new Date(req.query.end)},'port':req.query.port,'cancel_status':req.query.status});
            res.status(200).json({'error_code':200,
                                  'message':'Order Filter Based on Date,Status and Region',
                                'data':order  })

        
      
     
        

    }else{
        let order = await Order.find({});
        res.status(200).json({'error_code':200,
                              'message':'all orders',
                            'data':order  })
    }
}

module.exports = {
    filter_order
}