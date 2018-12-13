const Json2csvParser = require('json2csv').Parser;
const product = require('../../models/products');
const fs = require('fs');
const path = require('path');
const csv_file_path = path.join(__dirname, '../../public/csv/file.csv');
var multer = require('multer');
var csv = require('csvtojson');


const downloadCsv = async (req, res, next) => {
    var product_obj_arr = []
    product.find({
        'supplier_id': req.query.id
    }, function (err, result) {
        if (err) {
            res.status(500).json({
                'error_code': 500,
                'message': err
            });
        } else if (result.length === 0) {

            res.status(200).json({
                'error_code': 200,
                'message': 'There is no product'
            });
        } else if (result.length > 0) {

            console.log(result.length)

            result.forEach(function (item) {
                var dimension = [];
                var net_dimension = [];
                var img = [];

                var width;
                var height;
                var unit;
                var slab_count = [];
                console.log(item)
                item.net_dimension.forEach(function (result) {
                    // console.log(result);
                    width = result.width;
                    height = result.height;
                    unit = result.unit;
                    console.log(result.width)
                })

                item.dimension.forEach(function (result, index) {
                    // console.log(result);

                    dimension.push(result.width + '|' + result.height + '|' + result.thickness + '|' + result.unit);
                    // x = 'Slab-' + (index + 1);
                    // slab_count.push(x);


                })

                // item.dimension.forEach(function(result,index){
                //     // console.log(result);

                //     dimension.push(result.width+'|'+result.height+'|'+result.thickness+'|'+result.unit);
                //     // x='Slab-'+(index+1);
                //     // slab_count.push(x);


                // })

                item.images.forEach(function (result) {
                    // console.log(result);
                    img.push(result.path)

                })


                // console.log(img.join('|'));
                // console.log(net_dimension,dimension,img);
                product_obj_arr.push({
                    'product_name': item.product_name,
                    'slab': slab_count,
                    'product_type': item.product_type,
                    'product_type_code': item.product_type_code,
                    'bundle_number': item.bundle_number,
                    'quality': item.quality,
                    'price': item.price,
                    'color': item.color,
                    'net_width': width,
                    'net_height': height,
                    'net_unit': unit,
                    '\t\tdimension\n(Width,Height,Thickness,Unit)': dimension,
                    'images': img.join('|'),
                    'product_description': item.product_description,
                    'bundle_description': item.bundle_description,
                    'inspection_report': item.inspection_report,
                    'no_of_slabs': item.no_of_slabs,
                    'net_weight': item.net_weight
                });
                console.log(product_obj_arr);
                // console.log(product_obj_arr);
            })
            // product_obj_arr.forEach(function(result){
            //     console.log(result);

            // })



            const fields = ['product_name', 'product_type', 'product_type_code', 'bundle_number', 'quality', 'price', 'color', 'net_width', 'net_height', 'net_unit', '\t\tdimension\n(Width,Height,Thickness,Unit)', 'no_of_slabs', 'net_weight', 'product_description', 'bundle_description', 'inspection_report'];
            const json2csvParser = new Json2csvParser({
                fields,
                unwind: ['slab', 'images', '\t\tdimension\n(Width,Height,Thickness,Unit)'],
                unwindBlank: true,
                flatten: false
            });
            // res.status(200).json({'status_code':200,
            //                 'data':result});
            const csv = json2csvParser.parse(product_obj_arr);
            res.attachment('Product_info.csv');
            res.status(200).send(csv);


        }
        // console.log(csv);

    })








}

//problem still pending need to resolve 
//multi[ple dimension update is not working

const uploadCsv = async (req, res, next) => {
    var obj;

    if (req.files[0].mimetype !== 'text/csv') {
        res.status(422).send({
            'error_code': 422,
            'message': 'please upload proper CSV file.'
        })
    }
   

    csv()
        .fromFile(req.files[0].path)
        .then(async (jsonObj) => {
                    console.log(jsonObj)
                    var dimension_arr = [];
                  
                    var net_dimension = [];
                    var products = [];
                    prev = []
                    var product_obj={};
                    flag=0;
                    
                //    for(item of jsonObj) {
                       
                //     //    console.log(dimension_arr2);
                //         if (item.product_name !== '') {
                //             prev = dimension_arr;
                            
                //             dimension_arr.length = 0;
                            
                            
                //         }
                        
                    

                //         dimension = item['\t\tdimension\n(Width,Height,Thickness,Unit)'].split('|');

                        

                //         dimension_obj = {
                //             'width': dimension[0],
                //             'height': dimension[1],
                //             'thickness': dimension[2],
                //             'unit': dimension[3]
                //         }
                //         // if(item.product_name!==''){
                //         //     
                //         // }
                //         dimension_arr.push(dimension_obj);
                    
                        
                        
                        



                //     }
                    
               
                   i =-1;
                   flag =0 

                    jsonObj.forEach(function (item,index) {
                        
                        // console.log(product_obj)
                       
                        if ((item.product_name !== '' && flag === 1) || jsonObj.length===index) {
                            products.push(product_obj);
                            dimension_arr.length = 0;
                            flag = 0
                            i=i+1
                        }
                       

                        dimension = item['\t\tdimension\n(Width,Height,Thickness,Unit)'].split('|');

                        

                        dimension_obj = {
                            'width': dimension[0],
                            'height': dimension[1],
                            'thickness': dimension[2],
                            'unit': dimension[3]
                        }
                        // if(item.product_name!==''){
                        //     
                        // }
                        dimension_arr.push(dimension_obj);
                        

                        if (item.net_width !== '') {
                            net_dimension = [{
                                'width': item.net_width,
                                'height': item.net_height,
                                'unit': item.net_unit
                            }];
                        }
                        
                        // console.log(dimension_arr)
                       
                      
                       

                        if (item.product_name !== '' ) {
                            
                            product_obj = {
                                'product_name': item.product_name,
                                'supplier_id': req.body.supplier_id,
                                'bundle_number': item.bundle_number,
                                'product_type': item.product_type,
                                'product_type_code': item.product_type_code,
                                'quality': item.quality,
                                'price': item.price,
                                'color': item.color,
                                'net_dimension': net_dimension,
                                'slab_weight': item.slab_weight,
                                'bundle_number': item.bundle_number,
                                'no_of_slabs': item.no_of_slabs,
                                'dimension': dimension_arr,
                                'net_weight': item.net_weight,
                                'product_description': item.product_description,
                                'inspection_report': item.inspection_report
                            };
                            
                           flag = 1
                            //    console.log(product_obj)
                              
                            
                            
                        }else{
                            product_obj.dimension = dimension_arr
                         //  console.log(product_obj)
                        }
                        // console.log('p',products)
                      
                        
                       
                       

                    })
                    
                    // console.log(products)
                    vaild_doc=true
                   for(item of products){
                     try{
                       //  console.log(item)
                        //   console.log(await product(item).validate());
                        
                    
                    }
                    catch(err){
                        vaild_doc = false
                       res.json(err)
                       throw BreakException
                       
                     }

                    }
                    await product.deleteMany({'supplier_id':req.body.supplier_id},function(err,res){
                        if(err){
                            console.log('err')
                        }
                    })
                    await products.forEach(function(item){
                        product(item).save();
                    })
                    res.status(200).json({
                        'error_code':200,
                        'message':'Product updated Succesfully'
                    })
                    

                
                    
                    
              

        }).catch((err) => {
            console.log(err);
        });

}


module.exports = {

    downloadCsv,
    uploadCsv

}