const mongoose = require('mongoose');
const geo = require('../services/geocoding');
const Schema = mongoose.Schema;

const portSchema = new Schema({
    port_id: {
        type: String,

    },
    port_name: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: String,
        required: true,
        require: 'Country field is empty'
    },
    shipping_cost: {
        type: Number,
        required: true,
        require: 'Shipping cost is required'
    },
    port_cost: {
        type: Number,
        required: true,
        require: 'Port cost is required'
    },
    tax_percentage: {
        type: Number,
        required: true,
        require: 'Tax percentage field is required'
    },
    facilities_cost: {
        type: String,
        required: true
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    }
})

class PortClass {

    static async addPort(port_name, country, shipping_cost, port_cost, tax_percentage, facilities_cost) {
        let port_id = port_name + Math.round(Math.random(100, 999));


        //let geo_coding = await geo.geoCoding(port_name+country);
        // let result = await new Promise((rs, rj) => {
        //     geo.geoCoding(port_name + country, function (data, error) {
        //         if (data) {
        //             rs(data);
        //         } else {
        //             console.log(error);
        //         }
        //     })
        // });
        // console.log(result)
        
            // console.log("return", val)
            let port //,'lat':geo_coding['lat'],'lng':geo_coding['lng']
            port = {
                'port_id': port_id,
                'port_name': port_name,
                'country': country,
                'shipping_cost': shipping_cost,
                'port_cost': port_cost,
                'tax_percentage': tax_percentage,
                'facilities_cost': facilities_cost,
                // 'lat':result['lat'],
                // 'lng':result['lng']
            };
            console.log(port);
            port = new this(port).save();
            port = port.toObject();

            return port;

       



    }

    static async removePort(port_id, res) {


        this.findOneAndDelete({
            'port_id': port_id
        }, function (err, result) {

            if (err) {

                res.status(500).json({
                    'error_code': 500,
                    'message': 'Process failed.Sorry for the inconvenience.'
                })
            }
            if (result !== null) {
                res.status(200).json({
                    'error_code': 200,
                    'message': 'port data removed succesfully.',
                    'data': result
                })
            } else {
                res.status(200).json({
                    'error_code': 200,
                    'message': 'Port is not available.'
                })
            }
        })


    }

    static async updatePort(port_id, port_name, country, shipping_cost, port_cost, tax_percentage, res) {
        let port;
        port = {
            'port_id': port_id,
            'port_name': port_name,
            'country': country,
            'shipping_cost': shipping_cost,
            'port_cost': port_cost,
            'tax_percentage': tax_percentage
        };

        port = this.findOneAndUpdate({
            'port_id': port_id
        }, port, function (err, result) {
            if (err) {
                res.status(500).json({
                    'error_code': 500,
                    'message': 'Port update failed.Sorry for the inconvenience.'
                })
            }
            if (result !== null) {
                res.status(200).json({
                    'error_code': 200,
                    'message': 'port data updated succesfully.',
                    'data': result
                })
            } else {
                res.status(200).json({
                    'error_code': 200,
                    'message': 'Port is not available.Please add it first or check the data.'
                })
            }

        });




    }
}


portSchema.loadClass(PortClass);

module.exports = mongoose.model('port', portSchema);