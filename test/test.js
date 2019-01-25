var assert = require('assert');
var expect = require('chai').expect;
var app = require('../app');
var request = require('supertest');
const userCredentials = {
    email: '', 
    password: ''
  }
  var authenticatedUser = request.agent(app);
//   before(done => {
//     app.on('APP_STARTED', () => {
//         done()
//     })
// })



describe('Array',function(){
  
    describe('#indexof',function(){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
        it('should return -1',function(){
            request(app)
            .get('/customer/mostviewed')
            .set('Content-Type', 'application/json')
            .expect(200)
            .end(function(err, response){
                // console.log(err)
               
                // console.log('response',typeof response.statusCode)
              expect(response.statusCode).to.equal(400);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
            //  expect(response.body).to.be.empty;
            // done(err);
              
            })
    })
    it('should return -2',function(done){
        request(app)
        .get('/customer/mostviewed')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end(function(err, response){
            // console.log(response)
            done(err);
            // console.log('response',typeof response.statusCode)
        //   expect(response.statusCode).to.equal(400);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
        //  expect(response.body).to.be.empty;
          
        })
})
}) 
})
