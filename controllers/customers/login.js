
var passport = require('passport');
var jwt = require('jsonwebtoken');
var cart = require('../../models/cart')
var userModel =require('../../models/user');
const login = async(req,res,next)=>{
    passport.authenticate('user-login', {session: false,failureRedirect: '/login'}, function(err, user, info){
        
      if(err){
        return res.status(400).json({
          "error_code":400,
          "message":"Invalid input",
          "user":user
        })
      }
        req.login(user, {session: false}, (err) => {
          if (err) {
            res.status(400).json({
              "error_code":400,
              "message":"please try again later.",
              "data":err
            })
          }
      
      const token = jwt.sign({'user':user}, 'your_jwt_secret',{expiresIn: 6000});
      if(user){
        console.log(req)
        userModel.findOne({'email':req.body.email}).exec(function(err,result){
          result.password=undefined
          if(result.roles[0]==='customer'){
            cart.find({'user_id':result._id}).exec(function(err,result_cart){
              if(result_cart[0]!==undefined){
              // result['total_quantity']=result_cart[0].total_quantity;
              let user_detail = {'user_detail':result,'user':user}
              user_detail['total_quantity']=result_cart[0].total_quantity;
              console.log(user_detail)
              
              return res.json({user_detail, token});
              }else{
                let user_detail = {'user_detail':result,'user':user}
               
                
                return res.json({user_detail, token});
              }
  
            })

          }else{
            let user_detail = {'user_detail':result,'user':user}
         
            return res.json({user_detail, token});
          }
       
          
        })
      
      }else{
      res.redirect('/login');
      }
   });
  })(req, res,next);
    
  }

  module.exports = {
      login
  }
  