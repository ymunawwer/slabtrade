const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const CartNewSchema = new Schema({
    user_id:{
        type:String,
        required:true,
        unique:true
    },
    container:[{
        container_no:{
            type:Number
        },
        city:{
            type:String
        },
        total_bundle:{
            type:Number
        },
        total_cost:{
            type:Number
        },
        container_full:{
            type:Number,
            default:0
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
                },
                container_no:{
                    type:Number
                }
                
        
                
    
        }]


    }]
})
module.exports = mongoose.model('cartnew',CartNewSchema)