const User = require("../models/user");
const Cart = require("../models/cart");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB"
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "USER email does not exists"
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match"
      });
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front end
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully"
  });
};

exports.isSignedIn = expressJwt({
    secret : process.env.SECRET,
    userProperty: "auth"
});

//custom middlewares

exports.isAuthenticated = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth.id
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED!!"    
        })
    }
    next();
}

exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "YOU ARE NOT ADMIN....ACCESS DENIED!!"    
        })
    }
    next();
}

exports.addCart = (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg
      });
    }
    const cart = new Cart(req.body);
      cart.save((err, cart) => {
      if (err) {
        return res.status(400).json({
          err: "NOT able to save user in DB"
        });
      }
      res.json({
        total : cart.total,
        key: cart.encry_key,

      });
    });
  };

  exports.getAllOrders = (req,res) => {
    Cart.find().exec((err,carts)=>{
      if(err || !carts){
        return res.status(400).json({
          "message" : "Currently no new order",
        })
      }
      res.json(carts);
    })
  }

exports.getOrderById = (req, res) => {
    const errors = validationResult(req);
    const { encry_key } = req.body;
  
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg
      });
    }
  
    Cart.findOne({ encry_key }, (err, cart) => {
      if (err || !cart) {
        return res.status(400).json({
          error: "Id does not exists"
        });
      }
  
      if (!cart.active==0) {
        return res.status(401).json({
          error: "Order Deactivated"
        });
      }
  
      //create token
      const { eggs , veg1, non_veg1, total } = cart;
      return res.json({ user: { eggs , veg1, non_veg1, total } });
    });
  };