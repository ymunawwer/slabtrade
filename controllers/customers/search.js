var products = require('../../models/products');
const User = require('../../models/user');
const mongoose = require('mongoose')
const moments = require('moment')
const firstPageProductwithprice = async (req,res,next)=>{
    let typeArray = [];
    
    products.aggregate([
        { '$match' : {$and:[{ 'product_type_code': {'$gte':1,'$lte':3}  },{'verification':1}]} },
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
    products.find({$and:[{'product_type':req.query.id},{'verification':1}]}).exec(function(err,result){
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
        products.find({$and:[{'color':color},{'verification':1}]}).exec(function(err,result){
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
        
        { '$match' : {$and:[{ 'product_type_code': {'$gte':1,'$lte':3}},{'verification':1}   ]}},
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
    }else{
        for( y in result){
            for(x in result[y].docs){
             
                delete result[y].docs[x].price;
            }}

   
            if(result!==null){
                res.status(200).json({'error_code':200,'data':result});
                }else{
                    res.status(200).json({'error_code':204,'message':'No item found'}); 
                }
            }
    })

}




const searchQuery = async (req,res,next)=>{
    console.log(req.query.type);
    var perpage = 10;
    var page = Math.max(0, req.query.page);
    if(req.query.type==='producttype'){
    products.find({$and:[{'product_type':req.query.id},{'verification':1}]}).exec(function(err,result){
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
    
        products.find({$and:[{'color':color},{'verification':1}]}).exec(function(err,result){
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
    console.log('header',JSON.stringify(req.headers['auth']))
    if(typeof req.headers['auth'] !=='undefined'){
    console.log(req.query.supplier_id)
     var supplierId = []
    newly_added_item_supplier_city = await User.find({'_id':req.query.supplier_id})
    await User.find({'city':newly_added_item_supplier_city[0]['city']}).exec((err,result)=>{
        result.forEach(el=>{
            supplierId.push(new mongoose.Types.ObjectId(el['_id']));
            console.log('el',el['_id'])
        })
    })
    console.log(newly_added_item_supplier_city)
    console.log(supplierId)
    setTimeout(function(){
        products.find({$and:[{'supplier_id':{$in:supplierId}},{'verification':1}]}).exec((err,result)=>{
            if(err){
                res.status(500).json({
                    'error_code':500,
                    'message':err})
            }else{
                console.log(result)
            res.status(200).json({'error_code':200,'data':result})
            }
        })

    },2000)
}else if(typeof req.headers['auth'] ==='undefined'){
    console.log(req.query.supplier_id)
    var supplierId = []
   newly_added_item_supplier_city = await User.find({'_id':req.query.supplier_id})
   await User.find({'city':newly_added_item_supplier_city[0]['city']}).exec((err,result)=>{
       result.forEach(el=>{
           supplierId.push(new mongoose.Types.ObjectId(el['_id']));
           console.log('el',el['_id'])
       })
   })
   console.log(newly_added_item_supplier_city)
   console.log(supplierId)
   setTimeout(function(){
       products.find({$and:[{'supplier_id':{$in:supplierId}},{'verification':1}]}).exec((err,result)=>{
           if(err){
               res.status(500).json({
                   'error_code':500,
                   'message':err})
           }else{
            for(y in result){
                result[y]['price'] = undefined
            }
               console.log(result)
           res.status(200).json({'error_code':200,'data':result})
           }
       })

   },2000)

}
}





const searchByCity=async(req,res,next)=>{
    var supplier_id = []
    await User.find({'city':req.query.city}).exec((err,result)=>{
        result.forEach(el=>{
            supplier_id.push(new mongoose.Types.ObjectId(el['_id']));
            console.log('el',el['_id'])
        })
        
        // console.log('res',res)

    })
 
    setTimeout(async function(){

        products.aggregate([
            { '$match' : {$and:[{'supplier_id':{$in:supplier_id}},{'verification':1}]} },
            {       
                '$group': {
                    '_id': '$product_type',
                    'docs': { '$push': '$$ROOT' },
                }
            },
            {
                '$project':{ 
                    'docs':'$docs'
                }
                }
            
        ],function(err,result){
            if(err){
                res.status(500).json({
                    'error_code':500,
                    'message':'Something went wrong',
                    'data':err});
            }if(result.length!==0){
               
                console.log(result)
            result[0]['docs']
            res.status(200).json({'error_code':200,'data':result});
            }else{
                res.status(200).json({'error_code':204,'message':'No item found'}); 
            }});
    
    
    
    
    


        // let product =await products.find({'supplier_id':{$in:supplier_id}})
        // console.log(product)
        // if(product.length!=0){
           
        // res.status(200).json({'error_code':200,'message':'List of product based on city','data':product})
        // }else{
        //     res.status(200).json({'error_code':200,'message':'No Product for Search city.'})
    
        // }
     },1000)
}




const searchByCityWithoutPrice=async(req,res,next)=>{
    var supplier_id = []
    await User.find({'city':req.query.city}).exec((err,result)=>{
        result.forEach(el=>{
            supplier_id.push(new mongoose.Types.ObjectId(el['_id']));
            console.log(el['_id'])
            
        })
        
        // console.log('res',res)

    })
 setTimeout(async function(){


   
    products.aggregate([
        { '$match' : {$and:[{'supplier_id':{$in:supplier_id}},{'verification':1}]} },
        {       
            '$group': {
                '_id': '$product_type',
                'docs': { '$push': '$$ROOT' },
            }
        },
        {
            '$project':{ 
                'docs':'$docs'
            }
            }
        
    ],function(err,result){
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':'Something went wrong',
                'data':err});
        }if(result.length!==0){
            for( y in result){
                for(x in result[y].docs){
                 
                    delete result[y].docs[x].price;
                }}
            console.log(result)
        result[0]['docs']
        res.status(200).json({'error_code':200,'data':result});
        }else{
            res.status(200).json({'error_code':204,'message':'No item found'}); 
        }});





    // let product =await products.find({'supplier_id':{$in:supplier_id}})
    // console.log(product)
    // if(product.length!=0){
    //     for( y in product){
    //         product[y]['price'] = product[y]['price'] = undefined;
    //        }
       
    // res.status(200).json({'error_code':200,'message':'List of product based on city','data':product})
    // }else{
    //     res.status(200).json({'error_code':200,'message':'No Product for Search city.'})

    // }
 },1000)
    
   
}


const searchByRecentlyCreated=async(req,res,next)=>{
    let today_dates = Date.now();

    products.aggregate([
        { '$match' : {$and:[{'created_at':{$gte:moments(today_dates).subtract(7, "days").toDate()}  },{'verification':1}]} },
        {       
            '$group': {
                '_id': '$product_type',
                'docs': { '$push': '$$ROOT' },
            }
        },
        {
            '$project':{ 
                'docs':'$docs'
            }
            }
        
    ],function(err,result){
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':'Something went wrong',
                'data':err});
        }if(result.length!==0){
            
            console.log(result)
        result[0]['docs']
        res.status(200).json({'error_code':200,'data':result});
        }else{
            res.status(200).json({'error_code':204,'message':'No item found'}); 
        }});



//     let product = await products.find({'created_at':{$gte:moments(today_dates).subtract(7, "days").toDate()}});
// //product[0]['start_date']
//     console.log(moments(today_dates).subtract(7, "days").toISOString())
//     console.log(product.length)

//     if(product.length === 0){
//         res.status(200).json({
//             'error_code':200,
//             'message':'No Recently added Product Found'
//         })
//     }else if(product.length!==0){
//         res.status(200).json({
//             'error_code':200,
//             'message':'List of Recently added Product.',
//             'data':product
//         })

//     }else{
//         res.status(500).json({
//             'error_code':500,
//             'message':'Please try again.',
           
//         })

//     }
    

}


const searchByRecentlyCreatedwithoutPrice=async(req,res,next)=>{


    let today_dates = Date.now();

    products.aggregate([
        { '$match' : {$and:[{'created_at':{$gte:moments(today_dates).subtract(7, "days").toDate()}  },{'verification':1}]} },
        {       
            '$group': {
                '_id': '$product_type',
                'docs': { '$push': '$$ROOT' },
            }
        },
        {
            '$project':{ 
                'docs':'$docs'
            }
            }
        
    ],function(err,result){
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':'Something went wrong',
                'data':err});
        }else if(typeof result!=='undefined'){
            if(result.length!==0){
            for( y in result){
                for(x in result[y].docs){
                 
                    delete result[y].docs[x].price;
                }}
            console.log(result)
        result[0]['docs']
        res.status(200).json({'error_code':200,'data':result});
        }else{
            res.status(200).json({'error_code':204,'message':'No item found'}); 
        }}else{
            res.status(200).json({'error_code':204,'message':'No item found'}); 
        }
    });





//     let today_dates = Date.now();
//     let product = await products.find({'created_at':{$gte:moments(today_dates).subtract(7, "days").toDate()}});
// //product[0]['start_date']
//     console.log(moments(today_dates).subtract(7, "days").toISOString())
//     console.log(product.length)

//     if(product.length === 0){
//         res.status(200).json({
//             'error_code':200,
//             'message':'No Recently added Product Found'
//         })
//     }else if(product.length!==0){
//         for( y in product){
//             product[y]['price'] = product[y]['price'] = undefined;
//            }
//         res.status(200).json({
//             'error_code':200,
//             'message':'List of Recently added Product.',
//             'data':product
//         })

//     }else{
//         res.status(500).json({
//             'error_code':500,
//             'message':'Please try again.',
           
//         })

//     }
    

}



const searchByDeals=async(req,res,next)=>{

    products.aggregate([
        { '$match' : {$and:[{ 'isoffer': {'$eq':1}  },{'verification':1}]} },
        {       
            '$group': {
                '_id': '$product_type',
                'docs': { '$push': '$$ROOT' },
            }
        },
        {
            '$project':{ 
                'docs':'$docs'
            }
            }
        
    ],function(err,result){
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':'Something went wrong',
                'data':err});
        }if(result.length!==0){
          
            console.log(result)
        result[0]['docs']
        res.status(200).json({'error_code':200,'data':result});
        }else{
            res.status(200).json({'error_code':204,'message':'No item found'}); 
        }});



//     console.log(req)
// let product = await products.find({'isoffer':1});

// if(product.length === 0){
//     res.status(200).json({
//         'error_code':200,
//         'message':'No Deals Found.'
//     })
// }else if(product.length!==0){
//     res.status(200).json({
//         'error_code':200,
//         'message':'List of Deals.',
//         'data':product
//     })

// }else{
//     res.status(500).json({
//         'error_code':500,
//         'message':'Please try again.',
       
//     })

// }


}

const searchByDealsWithoutPrice=async(req,res,next)=>{

    products.aggregate([
        { '$match' : {$and:[{ 'isoffer': {'$eq':1}  },{'verification':1} ]}},
        {       
            '$group': {
                '_id': '$product_type',
                'docs': { '$push': '$$ROOT' },
            }
        },
        {
            '$project':{ 
                'docs':'$docs'
            }
            }
        
    ],function(err,result){
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':'Something went wrong',
                'data':err});
        }else if(typeof result!==undefined){
            if(result.length!==0){
            for( y in result){
                for(x in result[y].docs){
                 
                    delete result[y].docs[x].price;
                }}
            console.log(result)
        result[0]['docs']
        res.status(200).json({'error_code':200,'data':result});
        }else{
            res.status(200).json({'error_code':204,'message':'No item found'}); 
        }}
        else{
            res.status(200).json({'error_code':204,'message':'No item found'}); 
        }
    });


    // let product = await products.find({'isoffer':1});
    // if(product.length === 0){
    //     res.status(200).json({
    //         'error_code':200,
    //         'message':'No Deals Found.'
    //     })
    // }else if(product.length!==0){
    //     for( y in product){
    //         product[y]['price'] = product[y]['price'] = undefined;
    //        }
    //     res.status(200).json({
    //         'error_code':200,
    //         'message':'List of Deals.',
    //         'data':product
    //     })
    
    // }else{
    //     res.status(500).json({
    //         'error_code':500,
    //         'message':'Please try again.',
           
    //     })
    
    // }
}


const mostviewedauth=async(req,res,next)=>{
var product;
console.log(req.headers['auth']);
if(typeof req.headers['auth'] !=='undefined'){
    product = await products.find({'trendy':{$gte:1}});
    if(product.length === 0){
        res.status(200).json({
            'error_code':200,
            'message':'No Deals Found.'
        })
    }else if(product.length!==0){
     
        res.status(200).json({
            'error_code':200,
            'message':'List of Deals.',
            'data':product
        })
    
    }else{
        res.status(500).json({
            'error_code':500,
            'message':'Please try again.',
           
        })
    
    }

}else if(typeof req.headers['auth'] ==='undefined'){
    product = await products.find({'trendy':{$gte:1}});
    if(product.length === 0){
        res.status(200).json({
            'error_code':200,
            'message':'No Deals Found.'
        })
    }else if(product.length!==0){
        for( y in product){
            product[y]['price'] = product[y]['price'] = undefined;
           }
        res.status(200).json({
            'error_code':200,
            'message':'List of Deals.',
            'data':product
        })
    
    }else{
        res.status(500).json({
            'error_code':500,
            'message':'Please try again.',
           
        })
    
    }
}

}



const mostviewed=async(req,res,next)=>{
    products.aggregate([
        { '$match' : {$and:[{ 'trendy': {'$gte':1}  },{'verification':1} ]}},
        {       
            '$group': {
                '_id': '$product_type',
                'docs': { '$push': '$$ROOT' },
            }
        },
        {
            '$project':{ 
                'docs':'$docs'
            }
            }
        
    ],function(err,result){
        if(err){
            res.status(500).json({
                'error_code':500,
                'message':'Something went wrong',
                'data':err});
        }if(result.length!==0){
            console.log(result)
        result[0]['docs']
        res.status(200).json({'error_code':200,'data':result});
        }else{
            res.status(200).json({'error_code':204,'message':'No item found'}); 
        }});



    // var product;
    // console.log(req.headers['auth']);
    // if(typeof req.headers['auth'] !=='undefined'){
    //     product = await products.find({'trendy':{$gte:1}});
    //     if(product.length === 0){
    //         res.status(200).json({
    //             'error_code':200,
    //             'message':'No Deals Found.'
    //         })
    //     }else if(product.length!==0){
         
    //         res.status(200).json({
    //             'error_code':200,
    //             'message':'List of Deals.',
    //             'data':product
    //         })
        
    //     }else{
    //         res.status(500).json({
    //             'error_code':500,
    //             'message':'Please try again.',
               
    //         })
        
    //     }
    
    // }
}
    const mostViewedWithoutPrice=async(req,res,next)=>{
        products.aggregate([
            { '$match' : {$and:[{ 'trendy': {'$gte':1}  },{'verification':1} ]}},
            {       
                '$group': {
                    '_id': '$product_type',
                    'docs': { '$push': '$$ROOT' },
                }
            },
            {
                '$project':{ 
                    'docs':'$docs'
                }
                }
            
        ],function(err,result){
            if(err){
                res.status(500).json({
                    'error_code':500,
                    'message':'Something went wrong',
                    'data':err});
            }else if(typeof result!=='undefined'){
            
            if(result.length!==0){
                console.log(result)
                for( y in result){
                    for(x in result[y].docs){
                     
                        delete result[y].docs[x].price;
                    }}
            result[0]['docs']
            res.status(200).json({'error_code':200,'data':result});
            }else{
                res.status(200).json({'error_code':204,'message':'No item found'}); 
            }}else{
                res.status(200).json({'error_code':204,'message':'No item found'}); 
            }
        });



        // if(product.length === 0){
        //     res.status(200).json({
        //         'error_code':200,
        //         'message':'No Deals Found.'
        //     })
        // }else if(product.length!==0){
        //     for( y in product){
        //         product[y]['price'] = product[y]['price'] = undefined;
        //        }
        //     res.status(200).json({
        //         'error_code':200,
        //         'message':'List of Deals.',
        //         'data':product
        //     })
        
        // }else{
        //     res.status(500).json({
        //         'error_code':500,
        //         'message':'Please try again.',
               
        //     })
        
        // }
    }
    

    





//  Mostly viewed


module.exports = {
    firstPageProductwithprice,
    searchQuerywithprice,
    firstPageProduct,
    searchQuery,
    searchByCity,
    searchByCityWithoutPrice,
    searchByRecentlyCreated,
    searchByRecentlyCreatedwithoutPrice,
    getAllProduct,
    mostviewed,
    mostViewedWithoutPrice,
    
    searchByDeals,
    searchByDealsWithoutPrice
}