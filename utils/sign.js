/*
 * @Descripttion:
 * @version:
 * @Author: wenlan
 * @Date: 2021-12-14 14:55:53
 * @LastEditors: wenlan
 * @LastEditTime: 2021-12-15 20:16:37
 */

const { default: axios } = require('axios');
let { appid, secret } = require('../config/index');
const sha1 = require('sha1');
let ticketModel = require('../models/ticket.js');
//获取ticket
let getTicket = async function () {
    let tick_data = await ticketModel.find(); //从数据库获取ticket
    console.log('tock_data', tick_data);
    let access_token = '';
    let ticket = '';
    //ticket获取次数限制
    if (tick_data.length > 0) {
        let t = parseInt(new Date().getTime() / 1000) - tick_data[0].token_time;
        if (t > 7000000) {
            //是否过期
            await lodaData();
            console.log('ticket已经过期了');
            let { _id } = tick_data[0];
            await ticketModel.updateOne(
                { _id },
                {
                    access_token,
                    token_time: time,
                    ticket,
                    ticket_time: time,
                }
            );
        } else {
            access_token = tick_data[0].access_token;
            ticket = tick_data[0].ticket;
            console.log('从数据库中获取到：', access_token);
            console.log('从数据库中获取到：', ticket);
        }
    }
    //如何数据库不存在ticket
    else {
        let { access_token, ticket } = await lodaData();
        let time = parseInt(new Date().getTime() / 1000); //第一次获取对数据写入ticket到数据库
        await new ticketModel({
            access_token,
            token_time: time,
            ticket,
            ticket_time: time,
        }).save();
    }
    return {
        access_token,
        ticket,
    };
};

async function lodaData() {
    let tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
    let token_data = await axios.get(tokenUrl); //得到access-toekn
    console.log('token大大苏打撒旦萨达', token_data.data);
    access_token = token_data.data.access_token;
    let ticketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
    let ticket_data = await axios.get(ticketUrl);
    console.log('ticket只给你稳稳地挖挖达瓦', ticket_data.data);
    ticket = ticket_data.data.ticket;
    return {
        ticket,
        access_token,
    };
}

//处理签名格式
let handleCode = function (obj) {
    var keys = Object.keys(obj);
    keys = keys.sort(); //键名字典排序
    var newObj = {};
    keys.forEach(key => {
        newObj[key] = obj[key];
        // console.log(newObj);
    });
    var string = '';
    for (let k in newObj) {
        string += '&' + k + '=' + newObj[k];
    }
    string = string.substring(1);
    console.log('的海南岛爸那边你的', string);
    return string;
};

let createNoncerStr = function () {
    //生成随机字符串
    return Math.random().toString(36).substring(2, 15);
};

let createTimeStamp = function () {
    //生成时间戳
    return parseInt(new Date().getTime() / 1000);
};

let sign = async function (url) {
    let { ticket } = await getTicket();
    let obj = {
        jsapi_ticket: ticket,
        noncestr: createNoncerStr(),
        timestamp: createTimeStamp(),
        url,
    };
    let str = handleCode(obj); //格式处理
    let signature = sha1(str); //生成签名
    obj.signature = signature;
    obj.appid = appid;
    return obj;
};

// 签名生成规则如下：参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）,url（当前网页的URL，不包含#及其后面部分） 。
// 对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，
// 使用URL键值对的格式（即key1 = value1 & key2=value2…）拼接成字符串string1。这里需要注意的是所有参数名均为小写字符。
// 对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。
// 即signature=sha1(string1)。
exports.sign = sign;
exports.getTicket = getTicket;
