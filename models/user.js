const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const geo = require('../services/geocoding');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
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
      type:Number,
      required:true
  },

  roles: [{
    type: String,
    default: 'customer',
    required:true
  }],
  forgot_password: {
    token: String,
    expiry: Date,
  },
  admin_confirmation:{
      type:Boolean,
      default:false,
      rerequired:true
  },
  mailing_address:{
      type:String
  },
  mailing_city:{
      type:String
  },
  mailing_state:{
    type:String
},
mailing_country:{
    type:String
},
mailing_zip:{
    type:Number
},
port:{
    type:String
},
unload:{
    type:String
},
lat:{
    type:Number
},
lng:{
   type:Number
},
desc:{
    type:String
}
})


UserSchema.pre('save', function(next){ var user = this;
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

UserSchema.methods.comparePassword = function(formInputPassword, cb) {
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

    static async registerUser(alias,email,first_name, last_name,middle_name,password, home_phone,work_phone,cell_phone,account_type, address,city,state,country, zip, roles,mailing_address,mailing_city,mailing_state,mailing_country,mailing_zip,port,unload,desc) {
        email = email.toLowerCase();
        let userExist = await this.count({ email });
        if(userExist) throw new Error('Email is already exist.');
        let phoneExist = await this.count({cell_phone})
        if(phoneExist) throw new Error('Phone is already exist.');
        let accesstokens = [];
        let user;
        console.log(desc)
        console.log(typeof desc)
        // let result = await new Promise((rs, rj) => {
        //     geo.geoCoding(address+city+state+country, function (data, error) {
        //         if (data) {
        //             rs(data);
        //         } else {
        //             console.log(error);
        //         }
        //     })
        // });
        // console.log(result)
        if(typeof desc ==='undefined'){
            desc = "DESCRIPTION NOT AVAILABLE"
        }
       
        roles = roles ? [roles] : ['user'];//,'lat':geo_coding['lat'],'lng':geo_coding['lng']
        user = {'alias':alias,'email':email,'first_name':first_name,'last_name':last_name,'middle_name':middle_name,'password':password, 'home_phone':home_phone,'work_phone':work_phone,'cell_phone':cell_phone,'account_type':account_type, 'address':address,'city':city,'state':state,'country':country, 'zip_code':zip, 'roles':roles,'mailing_address':mailing_address,'mailing_city':mailing_city,'mailing_state':mailing_state,'mailing_country':mailing_country,'mailing_zip':mailing_zip,'port':port,'unload':unload,'desc':desc};//'lat':result['lat'],'lng':result['lng']};
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

UserSchema.loadClass(UserClass);
module.exports = mongoose.model('users',UserSchema);