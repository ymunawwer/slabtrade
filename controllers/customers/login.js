
var passport = require('passport');
var jwt = require('jsonwebtoken');
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
          let user_detail = {'id':result._id,'name':result.first_name,'user':user}
          return res.json({user_detail, token});
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
  