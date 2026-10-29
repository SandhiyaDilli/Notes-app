const express = require('express');
const db = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  try {
    const username = req.body.user_name;
    const password = req.body.password;
    if (!username || !password) {
  return res.status(400).send({ message: "Username and password are required" });
}
    const hashedPassword = await bcrypt.hash(password, 10);
    const store = await db.query(
      'insert into users(user_name,password) values($1,$2) returning u_id,user_name',
      [username, hashedPassword]
    );
    res.status(201).send({ message: "user created", user: store.rows[0] });
  } catch (error) {
    console.log(error);
   if(error.code == '23505'){
    return res.status(409).send({message:"Username taken. Try any other!"})
   }
   return res.status(500).send({message:"SignUp failed"});
  }
});

router.post('/login', async (req, res) => {
  try {
    const username = req.body.user_name;
    const password = req.body.password;
    if (!username || !password) {
     return res.status(400).send({ message: "Username and password are required" });
   }
    const key = await db.query('select u_id,password from users where user_name =$1', [username]);
    if (key.rows.length == 0) {
      return res.status(401).send({ message: "Invalid username or password!" });
    }
    const result = await bcrypt.compare(password, key.rows[0].password);
    if (result) {
      const token = jwt.sign({ u_id: key.rows[0].u_id }, process.env.JWT_SECRET, { expiresIn: '3h' });
      res.status(200).send({ message: "Logged In!", token: token });
    }
    else {
      res.status(401).send({ message: "Invalid username or password!" });
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong!"});
  }
});

module.exports = router;