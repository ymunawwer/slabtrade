var user = require('../../models/user');
var products = require('../../models/products');
var port = require('../../models/port');
var order = require('../../models/order')

const getMapData = async (req,res,next)=>{
   var order_obj = []
   var port_obj = await port.find({});
   var user_obj = await user.find({});
   var product_obj = await products.find({});
    order.find({}).exec((err,result)=>{
        if(err){
            console.log("alert");
        }
    
        result.forEach(el=>{
            if(element['cancel_status'] === 'Pending'){
                let obj = {}
                obj['status'] = element['cancel_status']
                let port = port_obj.filter(function(el){
                  return el['port_name'] === element['port']
                })
                obj['country'] = 'india'
                console.log('port',port)
                obj['lat'] = port[0]['lat']
                obj['lng'] = port[0]['lng']
                obj['order'] = element;
                order_obj.push(obj)
              }
              if(element['cancel_status'] === 'Accepted'){ 
               
                  let obj = {}
                  obj['status'] = element['cancel_status']
                  let port = port_obj.filter(function(el){
                    return el['port_name'] === element['port']
                  })
                  console.log('port',port)
                  obj['country'] = 'india'
                  obj['order'] = element;
                  obj['lat'] = port[0]['lat']
                  obj['lng'] = port[0]['lng']
                  order_obj.push(obj)
          
          
              }
              if(element['cancel_status'] === 'Shipped'){
                // supplier port need to fix
                 let obj ={} 
                obj['status'] = element['cancel_status']
                let port = port_obj.filter(function(el){
                  return el['port_name'] === element['port']
                })
                obj['country'] = 'india'
                console.log("port",port);
                obj['order'] = element;
                console.log(port)
                obj['lat'] = port[0]['lat']
                obj['lng'] = port[0]['lng']
                order_obj.push(obj)
              }
          
              if(element['cancel_status'] === 'Arrived'){
                let obj = {
          
                } 
                obj['status'] = element['cancel_status']
                let user = user_obj.filter(function(el){
                  return el['_id'] === element['user_id'][0]
                })
                obj['country'] = 'india'
                console.log("user",user)
                obj['order'] = element;
                console.log('deliver',user)
                obj['lat'] = user[0]['lat']
                obj['lng'] = user[0]['lng']
                order_obj.push(obj)
          
              }
          
              if(element['cancel_status'] === 'Delivered'){
                let obj = {
          
                } 
                obj['status'] = element['cancel_status']
                let user = user_obj.filter(function(el){
                  return el['_id'] === element['user_id'][0]
                })
                obj['country'] = 'india'
                obj['order'] = element;
                console.log('deliver',user)
                obj['lat'] = user[0]['lat']
                obj['lng'] = user[0]['lng']
                order_obj.push(obj)
          
              }
          
          
          
        })
    })
    }
    


