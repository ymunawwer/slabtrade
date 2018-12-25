const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user_id:{
        type:String,
        required:true,
        unique:true
    },
    
    bundle:[{
        
        bundle_id:{
                type:String,
                required:true,
                
                validate:{
                    validator:function(v){
                        return v!==null;
                    }
                }
            },
            supplier_id:{ type: Schema.Types.ObjectId, ref: 'supplier' },
            bundle_name:{
                type:String,
                required:true
            },
            net_area:{
                type:Number,
                required:true
            },
            thickness:{
                type:Number,
                required:true
            },
            Dimension:[{
                width:{
                    type:String,
                    reuired:true
                },
                height:{
                    type:String,
                    required:true
                },
                unit:{
                    type:String,
                    required:true
                }
            }],
            quantity:{
                type:Number,
                required:true
            },
            total:{
                type:Number,
                required:true
            }
            
    
            

    }],
    total_amount:{
        type:Number,
        required:true
    },
    total_quantity:{
        type:Number,
        default:0,
        required:true
    },
 
    tax:{
        type:Number,
        default:0,
        required:true

    },
    shipping_cost:{
        type:Number,
        default:0,
        required:true
    },
    cart_total:{
        type:Number,
        default:0,
        required:true
    }

})




class CartClass{

    static async addToCart(user_id,order_id){
        
        // let bundleid = await this.count({bundle_id});
        // if(bundleid) throw new Error('Email is already exist.');
        // let item;
        // item = {'order_id':order_id,'bundle':bundle,'tax':tax,'shipping_cost':shipping_cost,'cart_total':cart}

        // item = await new this(item).save();
        // item = item.toObject();
        // return item;

    }




    static async deleteAllItemFromCart(req,res,next){
        this.findOneAndRemove({ 'user_id': req.body.id }, function(err) {
            if (!err) {
                console.log('success');
                return res.send({'error_code':200,'message':'No item in the cart'});
            }
            else {
                console.log('error',err);
                next();
                
            }
        });

    }




    static async updateCart(id,bundle,tax,shipping_cost,cart_total){
        let updated_data = {'user_id':id,'bundle':bundle,'tax':tax,'shipping_cost':shipping_cost,'cart_total':cart_total};
        this.findOneAndUpdate({'user_id': id}, updated_data, {upsert:true}, function(err, doc){
            if (err) return res.send(500, { error: err });
            return res.send({'error_code':200,'message':'Succesfully saved'});
        });

    }
}


CartSchema.loadClass(CartClass);



module.exports = mongoose.model('cart',CartSchema)