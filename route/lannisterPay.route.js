const express = require("express")
const route = express.Router()
const {lannisterPay} = require("../controller/lannisterPay.controller")

// Calculating split info
route.post("/split-payments/compute", lannisterPay)

module.exports = route