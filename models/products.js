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
        type:String,
        required:true
    },
    Bundle_description:{
        type:String,
        required:true
    },
    inspection_report:{
        type:String,
        required:true
    },
    isoffer:{
        type:Number
    },
    offer_value:{
        type:Number,
       
    },
    start_date:{
        type:Date,
        default: Date.now,
       
    },
    end_date:{
        type:Date,
  

    },
    created_at:{
        type:Date,
        default: Date.now
    },
    trendy:{
        type:Number,
        default: 0
    },
    preference:{
        type:String
    }

})



class ProductClass{
    static async addProduct(product_name,supplier_id,product_type,product_type_code,quality,price,color,width,height,unit,thickness,slab_weight,bundle_number,no_of_slabs,dimension,net_dimension,net_weight,images,product_description,Bundle_description,inspection_report,offer_value,start_date,end_date,isoffer,preference){
        let bundleExist = await this.count({ bundle_number });
        if(bundleExist) throw new Error('Bundle is already exist.');
        console.log('dimension',typeof dimension)
        if(typeof dimension !=='object'){
            dimension=JSON.parse(dimension);
        }
        
        
        dimension.forEach((element,index) => {
            dimension[index]['thickness']=thickness;

            
        });
        let net__dimension = [{'width':width,'height':height,'unit':unit}]
        let product = {'product_name':product_name,'supplier_id':supplier_id,'product_type':product_type,'product_type_code':product_type_code,'quality':quality,'price':price,'color':color,'net_dimension':net__dimension,'thickness':thickness,'slab_weight':slab_weight,'bundle_number':bundle_number,'no_of_slabs':no_of_slabs,'dimension':dimension,'net_weight':net_weight,'images':images,'product_description':product_description,'Bundle_description':Bundle_description,'inspection_report':inspection_report,'offer_value':offer_value,'start_date':start_date,'end_date':end_date,'isoffer':isoffer,'preference':preference}
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