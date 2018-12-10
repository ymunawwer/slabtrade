const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const AdminSchema = new Schema({
  alias: {
    type: String,
    index: true,
    required:true
  },
  first_name:{
      type:String,
      required:true
      
  },
  last_name:{
      type:String,
      required:true
  },
  middle_name:{
      type:String,
  },
  email:{
      type:String,
      unique:true,
      required:true
  },
  password:{
      type:String,
      required:true
  },
  home_phone: {
    type: String,
    index: true,
  },
  work_phone:{
      type:String,
      
  },
  cell_phone:{
      type:String,
      required:true
  },
  account_type:{
      type:String,
      required:true
  },
  address:{
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
  zip_code:{
      type:String,
      required:true
  },

  roles: [{
    type: String,
    default: 'Admin',
    required:true
  }],
  forgot_password: {
    token: String,
    expiry: Date,
  },
//   admin_confirmation:{
//       type:Boolean,
      
//       required:true
//   }

});



AdminSchema.pre('save', function(next){ var user = this;
    if(!user.isModified('password')) return next();
    console.log("pre",user)
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err) return next(err);
        bcrypt.hash(user.password,salt,function(err,hash){
            if(err) return next(err);
            user.password = hash;
            
            next();
        })
    })
});

AdminSchema.methods.comparePassword = function(formInputPassword, cb) {
    bcrypt.compare(formInputPassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

class UserClass {

    static async doLogin(email,password,roles){
    email = email.toLowerCase();
    console.log('MODEL USER LOGIN = ', { email, roles: roles });
    var user = await this.findOne({email,roles});
    if (user === null) throw new Error('Email is not found.');
    else if (!commonHelper.comparePassword(password, user.password)) throw new Error('User name and password is not valid.');
    else {
        console.log('succesful');
    }


    }

    static async registerUser(alias,email,first_name, last_name,middle_name,password, home_phone,work_phone,cell_phone,account_type, address,city,state,country, zip, roles) {
        email = email.toLowerCase();
        let userExist = await this.count({ email });
        if(userExist) throw new Error('Email is already exist.');
        let phoneExist = await this.count({cell_phone})
        if(phoneExist) throw new Error('Phone is already exist.');
        let accesstokens = [];
        let user;
        roles = roles ? [roles] : ['user'];
        user = {'alias':alias,'email':email,'first_name':first_name,'last_name':last_name,'middle_name':middle_name,'password':password, 'home_phone':home_phone,'work_phone':work_phone,'cell_phone':cell_phone,'account_type':account_type, 'address':address,'city':city,'state':state,'country':country, 'zip':zip, 'roles':roles};
        console.log(user)
        user = await new this(user).save();
        
    //     if (successful) {//send otp if roles is user
    //      Send mail
    // }
    

    user = user.toObject();
    // user.accesstoken = token; //single token
    // delete user.picture;
    // delete user.password;
    // delete user.roles;
    // delete user.accesstokens;
    // delete user._id;
    // delete user.__v;
    return user;
    
    
    
    
    }




}

AdminSchema.loadClass(UserClass);
module.exports = mongoose.model('admin',AdminSchema);