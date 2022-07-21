'use strict'
const request = require('request');
const async = require('async');
const logger = require('../utils/logger');
const { application } = require('express');
//const getConnection = require('../config/db');
console.log("test");

let datum = {};
datum.getData = function (req, res){
    let ret = [];
    async.waterfall([
        // function(callback) {
        //     callback(null, initValue());
        // },
        // function(callback) {
        //     callback(null, getYt());
        // },
        // function(arg, callback) {
        //     callback(null, getReviewList());
        // },
        // function(arg, callback) {
        //     callback(null, getLocationInfo());
        // }
    ], function (err, result) {
        if(err){
            logger.error(err);
            res.socket.destroy();
            throw err;
        }else {
          res.set('Cache-Control', 'public, max-age=31557600');
          res.render('index');
            
        }  // 7
    });
};


module.exports = datum.getData;