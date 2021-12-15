/*
 * @Descripttion:
 * @version:
 * @Author: wenlan
 * @Date: 2021-12-13 17:40:30
 * @LastEditors: wenlan
 * @LastEditTime: 2021-12-15 16:05:24
 */
module.exports = app => {
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/book-mangement-system', {
        useUnifiedTopology: true, // 参数的固定写法
        useNewUrlParser: true, // 参数的固定写法
    });
    var db = mongoose.connection;

    // 连接成功
    db.on('open', function () {
        console.log('MongoDB Connection Successed');
    });
    // 连接失败
    db.on('error', function () {
        console.log('MongoDB Connection Error');
    });
};
