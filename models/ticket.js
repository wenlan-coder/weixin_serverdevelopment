const { Mongoose } = require('mongoose');

/*
 * @Descripttion:
 * @version:
 * @Author: wenlan
 * @Date: 2021-12-13 17:47:48
 * @LastEditors: wenlan
 * @LastEditTime: 2021-12-15 16:53:31
 */
const mongoose = require('mongoose');
const ticketSchema = new mongoose.Schema({
    //表结构
    access_token: String,
    token_time: Number,
    ticket: String,
    ticket_time: Number,
});
const ticketModel = mongoose.model('ticketModel', ticketSchema);
module.exports = ticketModel;
