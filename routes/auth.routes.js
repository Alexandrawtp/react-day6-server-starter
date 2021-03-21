const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User.model");

// Check if each field is ok

router.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({
      errorMessage: "Please fill in all fields.",
    });
    return;
  }

  const myRegex = new RegExp(
    /^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/
  );

  if (!myRegex.test(email)) {
    res.status(400).json({
      errorMessage: "Email format not correct",
    });
    return;
  }

  const myPassRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"
  );

  if (!myPassRegex.test(password)) {
    res.status(400).json({
      errorMessage:
        "Your password must contains at least 8 characters, one special symbol (!@#$%^&*), a number and an uppercase character",
    });
    return;
  }

// Create account with salted password

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);

  UserModel.create({ firstName: firstName, lastName: lastName, email: email, password: hash })
    .then((user) => {
      user.passwordHash = "***";
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(400).json({
          errorMessage: "This email already exists.",
        });
      } else {
        res.status(400).json({
          errorMessage: "Sorry, something went wrong. Please try again.",
        });
      }
    });
});

// Signin : check if email and password are fields, then check if they match

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      errorMessage: "Please fill in all fields."
    });
    return;
  }

  const myRegex = new RegExp(
    /^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/
  );

  if (!myRegex.test(email)) {
    res.status(400).json({
      errorMessage: "Email format not correct",
    });
    return;
  }
 
  UserModel.findOne({ email: email })
    .then((userData) => {
      bcrypt
        .compare(password, userData.password)
        .then((ifMatch) => {
          if (ifMatch) {
            userData.passwordHash = "***";
            req.session.loggedInUser = userData;
            res.status(200).json(userData);
          }
          else {
            res.status(400).json({
              errorMessage: "Passwords don't match",
            });
            return;
          }
        })
        .catch(() => {
          res.status(400).json({
            errorMessage: "Email format not correct",
            message: err
          });
          return;
        });
    })
    .catch((err) => {
      res.status(400).json({
        errorMessage: "Email does not exist",
        message: err
      });
      return;
    });
});

// Logout, session and protected routes

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(204).json({});
});

const isLoggedIn = (req, res, next) => {
  if (req.session.loggedInUser) {
    next();
  } else {
    res.status(401).json({
      errorMessage: "Unauthorized user",
      code: 401
    });
  }
};

// will handle all get requests to http:localhost:5005/api/user

router.get("/me", isLoggedIn, (req, res) => {
  res.status(200).json(req.session.loggedInUser);
  console.log(req.session.loggedInUser._id)
});

module.exports = router;
