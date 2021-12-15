/*
 * @Descripttion:
 * @version:
 * @Author: wenlan
 * @Date: 2021-12-10 23:42:33
 * @LastEditors: wenlan
 * @LastEditTime: 2021-12-14 23:06:25
 */
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const mySchema = new mongoose.Schema({});
const sha1 = require('sha1');
const myModal = mongoose.model('myModal', mySchema, 'books'); /* GET users listing. */

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/test', async (req, res) => {
    let data = await myModal.find();
    console.log(data);
    res.send({
        data,
    });
});
//鉴权
router.get('/auth', (req, res) => {
    let { signature, timestamp, nonce, echostr } = req.query;
    let token = 'sajmdasndsao';
    let array = [timestamp, nonce, token];
    array.sort(); //字典排序
    let str = array.join('');
    let resultStr = sha1(str);
    if (resultStr === signature) {
        res.set('Content-type', 'text/plain');
        res.send(echostr);
    } else {
        res.send('Error!');
    }
});

module.exports = router;
