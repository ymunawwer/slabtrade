const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const rulesSchema = new Schema({
bundle_type:{
    type:String,
    required:true

},
thickness:{
    type:Number,
    required:true
},
no_of_slabs:{
    type:Number,
    required:true

}

})


class ruleClass{
    static async createRule(bundle_type,thickness,no_of_slabs){
        let rules = {'bundle_type':bundle_type,'thickness':thickness,'no_of_slabs':no_of_slabs}
        rules = await new this(rules).save();
        return rules;

    }
}
rulesSchema.loadClass(ruleClass);


module.exports = mongoose.model('rule',rulesSchema);