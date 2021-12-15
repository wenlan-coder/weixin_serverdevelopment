/*
 * @Descripttion:
 * @version:
 * @Author: wenlan
 * @Date: 2021-12-10 23:42:33
 * @LastEditors: wenlan
 * @LastEditTime: 2021-12-15 18:09:08
 */
var express = require('express');
var router = express.Router();
let verify = require('../utils/sign');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/jsapi', async (req, res) => {
    let url = decodeURIComponent(req.query.url);
    console.log(url);
    let conf = await verify.sign(url);
    console.log('conf', conf);
    res.send({
        code: 200,
        conf,
    });
    // let data = await verify.getTicket();
    // console.log('data数据', data);
});

module.exports = router;
