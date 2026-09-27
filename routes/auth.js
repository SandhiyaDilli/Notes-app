const express = require('express');
const db = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  try {
    const username = req.body.user_name;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const store = await db.query(
      'insert into users(user_name,password) values($1,$2) returning u_id,user_name',
      [username, hashedPassword]
    );
    res.status(201).send({ message: "user created", user: store.rows[0] });
  } catch (error) {
    console.log(error);
   // res.status(500).send({ message: "SignUp failed", error: error.message });
   if(error.code == '23505'){
    return res.status(409).send({message:"Username taken.Try any other!"})
   }
   return res.status(500).send({message:"SignUp failed"});
  }
});

// make username uniquee laterrr---ALTER TABLE users ADD CONSTRAINT unique_username UNIQUE (user_name);

router.post('/login', async (req, res) => {
  //console.log(process.env.JWT_SECRET);
  try {
    const username = req.body.user_name;
    const password = req.body.password;
    if (username.length === 0 || password.length === 0) {
      return res.status(404).send({ message: "No user or password entered!" });
    }
    const key = await db.query('select u_id,password from users where user_name =$1', [username]);
    if (key.rows.length == 0) {
      return res.status(404).send({ message: "User not found!" });
    }
    const result = await bcrypt.compare(password, key.rows[0].password);
    if (result) {
      const token = jwt.sign({ u_id: key.rows[0].u_id }, process.env.JWT_SECRET, { expiresIn: '3h' });
      res.status(200).send({ message: "Logged In!", token: token });
    }
    else {
      res.status(401).send({ message: "Incorrect password" });
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed", error: error.message });
  }
});

module.exports = router;