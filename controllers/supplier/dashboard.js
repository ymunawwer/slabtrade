var Orders = require('../../models/order');
var Products = require('../../models/products')
var mongoose = require('mongoose')


const dashboard = async (req,res,next)=>{
    // total_order;
    var total_bundles = 0;
    var total_orders = 0;
    var total_slabs = 0;
    var day_to_day_sales;
    try{
    var orders = await Orders.find({'products.supplier_id':mongoose.Types.ObjectId(req.query.id)});
    var products = await Products.find({'supplier_id':mongoose.Types.ObjectId(req.query.id)});

    orders.forEach((element)=>{
       total_orders+=1
    })

    products.forEach(function(element){
        console.log(products)
        total_bundles +=element['no_of_slabs']
        total_slabs +=element['no_of_slabs']
    })
    total_slabs*=6;
    console.log(total_orders,total_bundles,total_slabs)
    res.status(200).json({"error_code":200,"data":{"total_orders":total_orders,"total_bundles":total_bundles,"total_slabs":total_slabs,"orders":orders,"products":products}})

}catch(error){
    res.status(500).json({"error_code":500,"message":"Please try again","data":error})
}
}


module.exports = {
    dashboard
}