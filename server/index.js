'use strict'

const cheerio = require("cheerio");
const request = require('request-promise');

const async = require('async');

const logger = require('../utils/logger');

const kcsOption = { 
    url:'https://gss.korea.ac.kr/ime/commu/notice.do'
};

let lastNo;

async function getNewItem() {
    return new Promise(function(resolve, reject){
        resolve(
           request(kcsOption).then(function (html) {

                const $ = cheerio.load(html);
                
                const $table = $('div.t_list test20200330');

                lastNo = $table.children('table').eq(0).children('tbody').eq(0).children(' ').eq(0).children('td').eq(0).text().trim();

            })
            
        ).reject(new Error('fail')).catch(() => {if(!response.socket.destroyed) response.socket.destroy();});
    });
}

let datum = {};
datum.getData = function (req, res){
    let ret = [];
    async.waterfall([
        function(callback) {
            callback(null, getNewItem());
        }
    ], function (err, result) {
        if(err){
            logger.error(err);
            res.socket.destroy();
            throw err;
        }else {
            let data;
            // console.log("values[i]:"+values[i]);
            data = {
                "lastNo":lastNo
            }
            ret.push(data);
            res.render('apiWraper', {ret:ret});
            
        } 
    });
};

module.exports = datum.getData;