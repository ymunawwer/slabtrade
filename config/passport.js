var passport = require('passport');
var LocalStrategy = require('passport-local')
var User = require('../models/user');
var Admin = require('../models/adminUser');

module.exports = function(passport){
    passport.serializeUser(function(user,done){
        done(null,user)
    });
    passport.deserializeUser(function(user,done){
        done(null,user);
    });

    passport.use('user-login',new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true,

    },
    function(req,email,password,done){
       
        User.findOne({ 'email' : email },
        function(err, user) {
            // console.log(user);
            if (err) {
                
                return done({'error_code':404,'message':'Unable to login.Please check the username and password.'});
            }
            if (!user) return done(400, false);
           
            user.comparePassword(password,function(err,isMatch){
                if(err) console.log(err);
                console.log('login console',isMatch);
                if(!isMatch){
                    return done(null, false);
                }
                else if(isMatch){
                    return done(null, true);
                }
            })


            // if (!user.comparePassword(password,function(err,isMatch){
            //     if(err) console.log(err);
            //     console.log('login',isMatch);
            //     return isMatch;
            // })) {
            //     // console.log(user);
            //   return done(null, false);
            // }
     
            // else
              
            //   return done(null, true); 
          });

    })
)

passport.use('admin-login',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true,

},
function(req,email,password,done){
   
    Admin.findOne({ 'email' : email },
    function(err, user) {
        // console.log(user);
        if (err) return done({'error_code':404,'message':'Unable to login.Please check the username and password.'});
 
        if (!user) return done(400, false);
       
        user.comparePassword(password,function(err,isMatch){
            if(err) console.log(err);
            console.log('login console',isMatch);
            if(!isMatch){
                return done(null, false);
            }
            else if(isMatch){
                return done(null, true);
            }
        })


      });

})
)
}