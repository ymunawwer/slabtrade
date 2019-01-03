var products = require('../../models/products');

const firstPageProductwithprice = async (req,res,next)=>{
    let typeArray = [];
    
    products.aggregate([
        { '$match' : { 'product_type_code': {'$gte':1,'$lte':3}  } },
        {       
            '$group': {
                '_id': '$product_type',
                'docs': { '$push': '$$ROOT' },
            }
        },
        {
            '$project': {
                'docs': { 
                    '$slice': ['$docs', 3]
                }
            }
        }
    ],function(err,result){
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':'Something went wrong',
                'data':err});
        }if(result.length!==0){
        result[0]['docs']
        res.status(200).json({'error_code':200,'data':result});
        }else{
            res.status(200).json({'error_code':204,'message':'No item found'}); 
        }
    })

}




const searchQuerywithprice = async (req,res,next)=>{
    console.log(req.query.type);
    var perpage = 10;
    var page = Math.max(0, req.query.page);
    if(req.query.type==='producttype'){
    products.find({'product_type':req.query.id}).limit(perpage).skip(page).exec(function(err,result){
      if(err){  res.status(500).json({
            'error_code':500,
            'message':'Something went wrong',
            'data':err});
    }
    if(result.length!==0){
    res.status(200).json({'error_code':200,'data':result});
    }else{
        res.status(200).json({'error_code':204,'message':'No item found'}); 
    }
    
      })
    }else if(req.query.type==='color'){
        let color = '#'+req.query.id;
        products.find({'color':color}).limit(perpage).skip(page).exec(function(err,result){
            if(err){  res.status(500).json({
                'error_code':500,
                'message':'Something went wrong',
                'data':err});
        }
        if(result.length!==0){
        res.status(200).json({'error_code':200,'data':result});
        }else{
            res.status(200).json({'error_code':204,'message':'No item found'}); 
        }
        
          })

    }else{
        res.status(400).json({
            'error_code':400,
            'message':'Invalid Request'
        });
    }

}


const firstPageProduct = async (req,res,next)=>{
    let typeArray = [];
    products.aggregate([
        
        { '$match' : { 'product_type_code': {'$gte':1,'$lte':3}  } },
        {       
            '$group': {
                '_id': '$product_type',
                
                'docs': { '$push': '$$ROOT'},
            }
        },
        {
            '$project': {
                'docs': { 
                    
                    '$slice': ['$docs', 3]
                    
                }  
            }
        }
    ],function(err,result){
        if(err){  res.status(500).json({
            'error_code':500,
            'message':'Something went wrong',
            'data':err});
    }
        for( y in result){
            for(x in result[y].docs){
             
                delete result[y].docs[x].price;
            }}

   
            if(result!==null){
                res.status(200).json({'error_code':200,'data':result});
                }else{
                    res.status(200).json({'error_code':204,'message':'No item found'}); 
                }
    })

}




const searchQuery = async (req,res,next)=>{
    console.log(req.query.type);
    var perpage = 10;
    var page = Math.max(0, req.query.page);
    if(req.query.type==='producttype'){
    products.find({'product_type':req.query.id}).limit(perpage).skip(page).exec(function(err,result){
        if(err){  res.status(500).json({
            'error_code':500,
            'message':'Something went wrong',
            'data':err});
    }
        if(result.length===0){
          res.status(204).json({
              'error_code':204,
              'message':'No item found.'
          });
        }else{
            for(x in result){
                   
                for(y in x){
                    result[x].price = undefined;
                    
                   
                }
            }
            if(result.length!==0){
            res.status(200).json({'error_code':200,'data':result});
            }
        }
    
      })
    }else if(req.query.type==='color'){
        let color = '#'+req.query.id;
    
        products.find({'color':color}).limit(perpage).skip(page).exec(function(err,result){
            if(err){  res.status(500).json({
                'error_code':500,
                'message':'Something went wrong',
                'data':err});
        }

            if(result.length===0){
                res.status(204).json({
                    'error_code':204,
                    'message':'No item found.'
                })
            }else{
                for(x in result){
                   
                    for(y in x){
                        result[x].price = undefined;
                        
                       
                    }
                }
                
                     
                
                res.status(200).json({'error_code':200,'data':result});
            }
        
          })

    }else{
        res.status(400).json({
            'error_code':400,
            'message':'Invalid Request'
        });
    }

}


const getAllProduct=async(req,res,next)=>{
    products.find({'supplier_id':req.query.supplier_id}).limit(req.query.limit).exec((err,result)=>{
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':err})
        }else{
        res.status(200).json({'error_code':200,'data':result})
        }
    })
}





module.exports = {
    firstPageProductwithprice,
    searchQuerywithprice,
    firstPageProduct,
    searchQuery,
    getAllProduct
}