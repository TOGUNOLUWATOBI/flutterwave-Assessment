// Require dependencies
require("dotenv").config({});
const express = require("express");

const app = express();

// use dependencies
app.use(express.json())
app.use(express.urlencoded({extended : false}))

// Require routes
const lannisterPayRoute = require("./route/lannisterPay.route")

// Use route
app.use(lannisterPayRoute) 


app.listen(process.env.PORT, (req,res) =>{
console.log(`The port is running on port ${process.env.PORT}`)})