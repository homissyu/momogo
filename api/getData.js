'use strict'

const cheerio = require("cheerio");
const request = require('request-promise');

const async = require('async');

const logger = require('../utils/logger');


const kcsOption = { 
    url:'https://scs.korea.ac.kr/ime/commu/notice.do',
    // headers: {
    //     'sec-ch-ua-mobile': '?0',
    //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36 Edg/103.0.1264.77',
    //     'sec-ch-ua-platform': '"Windows"',
    //     'sec-ch-ua': '" Not;A Brand";v="99", "Microsoft Edge";v="103", "Chromium";v="103"',
    //     'Accept': '*/*',
    //     'Sec-Fetch-Site': 'none',
    //     'Sec-Fetch-Mode': 'cors',
    //     'Sec-Fetch-Dest': 'empty',
    //     'Accept-Encoding': 'gzip, deflate, br',
    //     'Accept-Language': 'ko,en;q=0.9,en-US;q=0.8',
    //     'Cookie': 'ch-veil-id=c31242a7-ff4d-4974-ac15-0d2cb3183c0b; CTLKEY=FpMea4grY2N2b5LRX07FfXJ3pc6Gp1LniD32; ApproveID=homissyu; ApproveName=%C3%D6%B1%A4%C8%A3; ApproveType=PF; ReturnURL=http://ctl.korea.ac.kr; __gads=ID=e9ef4e16faf385a2:T=1638854444:S=ALNI_MYVLjKZRtoAq_kuzj3n2RJj4xR6TA; _hjSessionUser_1290436=eyJpZCI6ImUxY2UwNDIyLWM0YTMtNWM4ZC04ZDJlLTViZGMzZGE2MmNlYSIsImNyZWF0ZWQiOjE2MzkxNDIyNDUzNTMsImV4aXN0aW5nIjp0cnVlfQ==; AMCV_4D6368F454EC41940A4C98A6%40AdobeOrg=-2121179033%7CMCIDTS%7C18973%7CMCMID%7C63286648751190362990735827371222934411%7CMCAID%7CNONE%7CMCOPTOUT-1639202023s%7CNONE%7CMCAAMLH-1639799623%7C11%7CMCAAMB-1639799623%7Cj8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI%7CMCCIDH%7C-350488951%7CvVersion%7C5.3.0%7CMCSYNCSOP%7C411-18980; s_pers=%20v8%3D1639194829223%7C1733802829223%3B%20v8_s%3DFirst%2520Visit%7C1639196629223%3B%20c19%3Dsd%253Apdfft%253Apdf%253Aurl%7C1639196629232%3B%20v68%3D1639194828635%7C1639196629250%3B; AMCV_8E929CC25A1FB2B30A495C97%40AdobeOrg=1687686476%7CMCIDTS%7C18969%7CMCMID%7C47291039290910479440535185883795022892%7CMCAID%7CNONE%7CMCOPTOUT-1641137794s%7CNONE%7CMCAAMLH-1641735395%7C11%7CMCAAMB-1641735395%7Cj8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI%7CMCSYNCSOP%7C411-19002%7CvVersion%7C3.0.0; __utmz=85685891.1642402784.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _hjSessionUser_2075053=eyJpZCI6IjdiODE5YWYyLWQzMTgtNWQxMi04NzA5LWY4Njk3NGM1ZjQ2MiIsImNyZWF0ZWQiOjE2NDI5ODg1MTM4NjgsImV4aXN0aW5nIjp0cnVlfQ==; apt.uid=AP-PQQY5YJEHTTA-2-1643977803791-23337555.0.2.8e88e7df-b213-417d-ae1e-90ccb15ee1e2; __utma=85685891.526325490.1613281491.1642465795.1647856049.3; _ga_K1RXG4W610=GS1.1.1655127304.348.0.1655127304.60; optimizelyEndUserId=oeu1656662829400r0.9844142969386578; amplitude_id_9f6c0bb8b82021496164c672a7dc98d6_edmkorea.ac.kr=eyJkZXZpY2VJZCI6ImM1NTJhYzRhLTA0ZDItNDY5Zi05NmM1LTM1MmViM2M2Yjk0YVIiLCJ1c2VySWQiOm51bGwsIm9wdE91dCI6ZmFsc2UsInNlc3Npb25JZCI6MTY1NjY2MjgzMTY3NywibGFzdEV2ZW50VGltZSI6MTY1NjY2MjgzMTY3OSwiZXZlbnRJZCI6MCwiaWRlbnRpZnlJZCI6MzIsInNlcXVlbmNlTnVtYmVyIjozMn0=; amplitude_id_408774472b1245a7df5814f20e7484d0korea.ac.kr=eyJkZXZpY2VJZCI6ImI5YmQ1MzJhLTliYjUtNGM3Ni05M2EyLWY4OGI4NDAzZTliNSIsInVzZXJJZCI6Ii0xMTkzODk0MjIiLCJvcHRPdXQiOmZhbHNlLCJzZXNzaW9uSWQiOjE2NTY2NjI4MzI4MjcsImxhc3RFdmVudFRpbWUiOjE2NTY2NjI4MzM3OTgsImV2ZW50SWQiOjc1LCJpZGVudGlmeUlkIjoxMDYsInNlcXVlbmNlTnVtYmVyIjoxODF9; _hp2_id.1083010732=%7B%22userId%22%3A%227634840564119544%22%2C%22pageviewId%22%3A%223335542152550107%22%2C%22sessionId%22%3A%224701574548372174%22%2C%22identity%22%3Anull%2C%22trackerVersion%22%3A%224.0%22%7D; _hjid=4dc72eec-2513-47ad-9201-706f846dab9f; _ga=GA1.3.526325490.1613281491; _ga_9KSFHNQEY6=GS1.1.1656732501.29.0.1656732501.0; JSESSIONID=CMQsjC1DTTLRyXRYpnLZqwGpV3Pb3JgYNfqmRwppxnph22WG5l1Y!2050311554; ime_visited=20220821232155833048; org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE=ko; _gid=GA1.3.1711634409.1661091720; develop_preview_mode=N'
    // },
    // referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
};

let lastNo;

const regExp = /,/g; // 천단위 쉼표를 찾기 위한 정규식. 
// console.log("getNewItem");
        
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