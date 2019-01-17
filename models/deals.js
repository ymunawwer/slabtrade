var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DealSchema = new Schema(
    {
        product_type:{
            type:String,
            
        },
        offer_value:{
            type:Number,
            required:true
        },
        start_date:{
            type:Date,
            default: Date.now,
            required:true
        },
        end_date:{
            type:Date,
            required:true

        },
        supplier_id:{
                type:String
                
            },
        bundle_number:{
            type:String
        },
        first_name:{
            type:String

        }

    }
)


class DealsClass{
    static async createDeal(product_type,offer_value,start_date,end_date){
        
        var deals = {
            

            'product_type':product_type,

            'offer_value':offer_value,

            'start_date':start_date,
            
            'end_date':end_date

        }
        // deals = await new this(deals).save();
        deals = await this.updateOne({'product_type':product_type},deals,{upsert:true})
        // deals = deals.toObject();

        return deals;
    
    
    
    }
    static async createDealBySupplier(first_name,product_type,offer_value,start_date,end_date,supplier_id){
        
        var deals = {
            'first_name':first_name,
            
            'bundle_number':bundle_number,

            'offer_value':offer_value,

            'start_date':start_date,
            
            'end_date':end_date,


            'supplier_id':supplier_id

        }
        // deals = await new this(deals).save();
        deals = await this.updateOne({'product_type':product_type},deals,{upsert:true})
        // deals = deals.toObject();

        return deals;
    
    
    
    }
}


DealSchema.loadClass(DealsClass);

module.exports = mongoose.model('deal',DealSchema);