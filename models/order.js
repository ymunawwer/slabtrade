var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    
    user_id:[{ type: Schema.Types.ObjectId, ref: 'users' }],
    
    
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
        supplier_id:{ type: Schema.Types.ObjectId, ref: 'supplier' },
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
            thickness:{
                type:Number
            }
            
            
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


    }],
    wired_doc:[{
        path:{
        type:String
        }


    }]
    ,
    payment_status:{
        type:String,
        default:"Pending"
    },
    price:{
        type:Number
    },
    purchase_order:[{
        path:{
        type:String
        }


    }],
    tax:{
        type:Number
    },
    service:{
        type:Number

    },
    total:{
        type:Number
    },
    port:{
        type:String,
        required:true
    },
    shipping_Addr:[{
        street:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        zip:{
            type:String,
            required:true
        },
    }],
   unload:{
       type:String,
       required:true
   }




})

class OrderClass{
    static async createOrder(userID,supplierID,name,cancelstatus,products,container,price,tax,service,total,port,shipping_Addr,unload){


        order = {'user_id':userID,'supplier_id':supplierID,'cancel_status':cancelstatus,'products':products,'container_no':container,'price':price, 'tax':tax,'service':service,'total':total,'port':port,'shipping_Addr':shipping_Addr,'unload':unload};
        console.log(order)
        order = await new this(order).save();
        order = order.toObject();
        return order;

    }
    



}

orderSchema.loadClass(OrderClass);




module.exports = mongoose.model('order',orderSchema);
