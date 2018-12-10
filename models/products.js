const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    supplier_id:{
        type:Schema.Types.ObjectId,
        required:true
    },
    bundle_number:{
        type:String,
        required:true
    },
    no_of_slabs:{
        type:Number,
        required:true
    },
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
        type:Number,
        required:true
    }
        
    }],
    product_name:{
        type:String,
        required:true
    },
    product_type:{
        type:String,
        required:true
    },
    product_type_code:{
        type:Number,
        required:true
    },
    quality:{
        type:String,
        required:true
    },
    images:[{
        path:{
        type:String,
        required:true}
    }],
    price:{
        type:Number
    },
    color:{
        type:String,
        required:true
    },
    net_dimension:[{
        width:{
            type:Number,
          required:true
        },
        height:{
            type:Number,
          required:true
        },
        unit:{
            type:String,
            required:true

        }
    }],
    
    slab_weight:{
        type:Number
    },
    net_weight:{
        type:Number,
        required:true
    },
    product_description:{
        type:String
    },
    Bundle_description:{
        type:String
    },
    inspection_report:{
        type:String
    }

})



class ProductClass{
    static async addProduct(product_name,supplier_id,product_type,product_type_code,quality,price,color,width,height,unit,thickness,slab_weight,bundle_number,no_of_slabs,dimension,net_dimension,net_weight,images,product_description,Bundle_description,inspection_report){
        let bundleExist = await this.count({ bundle_number });
        if(bundleExist) throw new Error('Bundle is already exist.');
        let net__dimension = [{'width':width,'height':height,'unit':unit}]
        let product = {'product_name':product_name,'supplier_id':supplier_id,'product_type':product_type,'product_type_code':product_type_code,'quality':quality,'price':price,'color':color,'net_dimension':net__dimension,'thickness':thickness,'slab_weight':slab_weight,'bundle_number':bundle_number,'no_of_slabs':no_of_slabs,'dimension':dimension,'net_weight':net_weight,'images':images,'product_description':product_description,'Bundle_description':Bundle_description,'inspection_report':inspection_report}
        console.log(product);
        product = await new this(product).save();
        return product;
    }

    static async removeProduct(){

    }


    static async updateProduct(){
        

    }


    static async updateBulkProduct(){


    }

}




ProductSchema.loadClass(ProductClass);

module.exports = mongoose.model('products',ProductSchema);