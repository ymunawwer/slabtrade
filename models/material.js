const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const MaterialSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
})


class MaterialClass{
    static async createMaterial(name){
        let material = {'name':name};
        material = await new this(material).save()
        return material

    }
}

MaterialSchema.loadClass(MaterialClass)

module.exports = mongoose.model('material',MaterialSchema)


