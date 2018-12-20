var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    
    user_id:[{ type: Schema.Types.ObjectId, ref: 'users' }],
    supplier_id:{ type: Schema.Types.ObjectId, ref: 'supplier' },
    
    name:{
        type:String,
        required:true
    },

    created_at:{
        type:Date,
        default: Date.now
    },
    cancel_status:{
        type:String,
        required:true

    },
    payment:{
        type:String,
        require:true,
        required:'Payment is required'

    },


    products:[{
       
        bundle_id:{ type: String     },
        dimension:[{
            width:{
                type:Number
            },
            height:{
                type:Number
            },
            unit:{
                type:String
            },
            
            
        }],
        quantity:{
            type:Number
        },
        price:{
            type:Number
        }
    }],
    container_no:{
        type:Number

    },
    shipping_doc:[{
        path:{
        type:String
        }


    }]
    ,
    price:{
        type:Number
    },
    tax:{
        type:Number
    },
    service:{
        type:Number

    },
    total:{
        type:Number
    }




})

class OrderClass{
    static async createOrder(userID,supplierID,name,cancelstatus,products,container,price,tax,service,total){


        order = {'user_id':userID,'supplier_id':supplierID,'cancel_status':cancelstatus,'products':products,'container_no':container,'price':price, 'tax':tax,'service':service,'total':total};
        console.log(order)
        order = await new this(order).save();
        order = order.toObject();
        return order;

    }
    



}

orderSchema.loadClass(OrderClass);




module.exports = mongoose.model('order',orderSchema);
