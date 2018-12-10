var multer = require('multer');
var path = require('path');


var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname,'../public/upload/products'))
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now()+'-'+file.originalname);
    }
});
var upload = multer({storage: storage});

var storage_csv = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,'../public/upload/csv'))
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now()+'-'+file.originalname);
  }
});
var bulk_update = multer({storage: storage_csv});

var storage_shippment = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,'../public/upload/shipment_doc'))
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now()+'-'+file.originalname);
  }
});
var shipment_upload = multer({storage: storage_shippment});



module.exports = {
    upload,bulk_update,shipment_upload
}
