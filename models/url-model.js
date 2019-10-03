var mongoose = require('mongoose'); 

var urlSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    }, 
    url: {
        type: String, 
        required: true
    }
}); 

var Url = module.exports = mongoose.model('url', urlSchema); 

module.exports.get = function (callback, limit) { 
    Url.find(callback).limit(limit); 
};