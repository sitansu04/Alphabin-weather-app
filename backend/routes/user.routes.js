const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usermodel } = require("../models/user.model");
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const exist_user = await Usermodel.find({ email: email });
    console.log(exist_user);
    if (exist_user.length == 1) {
      res.status(500).send({ msg: "User already exists please try to login" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.status(400).send({ err: err.message });
          console.log(err);
        } else {
          const new_user = new Usermodel({
            email,
            password: hash
          });
          await new_user.save();
          res.status(201).send({ msg: `register successfully` });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usermodel.findOne({ email });
    const hashed_pass = user.password;
    if (user) {
      bcrypt.compare(password, hashed_pass, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user._id }, "sitansu");
          res.status(201).send({ msg: "Login Successfull", token: token });
        } else {
          res.status(400).send({ msg: "Login Failed" });
        }
      });
    } else {
      res.status(400).send({ msg: "Wrong Inputs" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = {
  userRouter,
};
