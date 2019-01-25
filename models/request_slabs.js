var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSlabSchema = new Schema(
    {
        first_name:{
            type:String
        },
        supplier_name:{
            type:String
        },
        product_name:{
            type:String

        },
        bundle_number:{
            type:String
        },
        action:{
            type:Number
        },
        type:{
            type:String
        }

    })
// 4. Action - requested - 0/ fullfilled (Buttons) -1


class RequestSlab{
    static async createRequest(first_name,supplier_name,product_name,bundle_number,action,type){
      
        let requestExist = await this.count({$and:[ {'bundle_number':bundle_number},{'first_name':first_name }]});
        console.log(requestExist)
        if(requestExist) throw new Error('Request is already exist.');
   
        
        let request_slab = {'first_name':first_name,'supplier_name':supplier_name,'product_name':product_name,'bundle_number':bundle_number,'action':action,'type':type}
        console.log(request_slab);
        request_slab = await new this(request_slab).save();
        return request_slab;
        
    }
}

RequestSlabSchema.loadClass(RequestSlab);

module.exports = mongoose.model('requestslab',RequestSlabSchema)