const { Router } = require("express");
const express = require('express');

const router = express.Router();
const {check} = require("express-validator");

const {signout,signup, signin, isSignedIn, addCart, getAllOrders}= require('../controllers/auth')

router.post("/signin",[
    check("email","Enter a valid email").isEmail(),
    check("password","Password should be at  least 5 letters long").isLength({min: 5}),
],signin); 

router.post("/signup",[
    check("name","NAme should be at  least 2 letters long").isLength({min: 2}),
    check("email","Enter a valid email").isEmail(),
    check("password","Password should be at  least 5 letters long").isLength({min: 5}),
],signup); 

router.get("/signout",signout)

router.post("/addCart",isSignedIn,addCart); 

router.post("/warden",isSignedIn,getAllOrders);

router.post("/checkID",isSignedIn,getAllOrders);

module.exports = router