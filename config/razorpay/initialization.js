const Razorpay = require('razorpay')
const config = require('../config')

const instance = new Razorpay(config.razorpay)

module.exports = instance