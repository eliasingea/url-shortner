Url = require('../models/url-model'); 
var hashFunction = require('hash.js'); 

var NodeCache = require('node-cache'); 
var urlCache = new NodeCache(); 

//get all urls from the index
exports.index = function (req, res) {
    Url.get(function(err, urls) {
        if(err) {
            res.json({
                status: "error", 
                message: err,
            });
        }
        res.json({
            status: "success", 
            message: "Urls successfully retrieved", 
            data: urls
        });
    }); 
};

//create a new url or return one if it already exists in the database
exports.new = function(req, res) {
    var url = req.body.url;
    //truncate the hash so that it only takes the first 7 characters. 
    var hash = hashFunction.sha256().update(url).digest('hex').slice(0, 7);
    console.log(hash); 
    var firstUrlPart = "http://su.rl/"; 
    
    //we try and get from cache
    try {
        value = urlCache.get(url);
        console.log(value); 
        //if the url is in cache then just render the page and return
        if(value) {
            console.log("were in the cache get");
            res.render('index', {shortenedUrl: firstUrlPart + value, originalUrl: url}); 
            return; 
        } else {
            //if not in the index then set the url in cache for the next time
            urlCache.set(url, hash); 
        }
    } catch (err) {
        res.json({
            err: err
        });
    }
    //we first look inside the database to see if we can find the url
    Url.findOne({ _id: hash }).select("_id").lean().then(result => {
        if (result) {
            //we render the page if found
            res.render('index', {shortenedUrl: firstUrlPart + result._id, originalUrl: url }); 
        } else {
            //if not we create a new instance of Url object
            var shortenedUrl = new Url(); 
            shortenedUrl.url = url;
            shortenedUrl._id =  hash;
            //we save to the database
            shortenedUrl.save(function (err) {
                if(err) {
                    res.json(err); 
                }
                //finally render the page with the new URL
                res.render('index', {shortenedUrl: firstUrlPart + hash, originalUrl: url }); 
            });
        }
    });
}; 