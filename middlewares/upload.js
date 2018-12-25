var multer = require('multer');
var path = require('path');
var multerS3 = require('multer-s3') 
const AWS = require('aws-sdk');
const s3bucket = new AWS.S3({
  accessKeyId: 'AKIAJ33XIE4N47MWST5Q',
  secretAccessKey: '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',
  Bucket:'slab-trade-upload'
 });



// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, path.join(__dirname,'../public/upload/products'))
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.fieldname + '-' + Date.now()+'-'+file.originalname);
//     }
// });
//var upload = multer({storage: storage});
var upload = multer({
  storage: multerS3({
    s3: s3bucket,
    bucket: 'slab-trade-upload',
    key: function (req, file, cb) {
      console.log(file);
      cb(null, file.fieldname + '-' + Date.now()+'-'+file.originalname);
      
    }
  })
})

var bulk_update = multer({
  storage: multerS3({
    s3: s3bucket,
    bucket: 'slab-trade-upload',
    key: function (req, file, cb) {
      console.log(file);
      cb(null, file.fieldname + '-' + Date.now()+'-'+file.originalname);
      
    }
  })
})


var shipment_upload = multer({
  storage: multerS3({
    s3: s3bucket,
    bucket: 'slab-trade-upload',
    key: function (req, file, cb) {
      console.log(file);
      cb(null, file.fieldname + '-' + Date.now()+'-'+file.originalname);
      
    }
  })
})


// var storage_csv = multer.diskStorage({
  
//   destination: (req, file, cb) => {
    
//     cb(null, path.join(__dirname,'../public/upload/csv'))
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now()+'-'+file.originalname);
//   }
// });
// var bulk_update = multer({storage: storage_csv});

// var storage_shippment = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname,'../public/upload/shipment_doc'))
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now()+'-'+file.originalname);
//   }
// });
// var shipment_upload = multer({storage: storage_shippment});





module.exports = {
    upload,bulk_update,shipment_upload
}
