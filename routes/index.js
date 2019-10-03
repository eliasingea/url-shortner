/////////////////////////////////
// Require the modules
/////////////////////////////////
var express 		= require('express');
var router 			= express.Router();

router.get('/',function(req,res){
    res.status(200).json({ message: 'Connected!' });
});

var urlController = require('../controllers/url-controller'); 

router.route('/urls')
    .get(urlController.index)
    .post(urlController.new); 
module.exports = router; 