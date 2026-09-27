const express = require('express');
const router = express.Router();
const db = require('../db.js');
const authenticate = require('../middleware/auth.js');

router.post('/', authenticate, async (req, res) => {
    try {
        const { t_name } = req.body;
        if (!t_name || t_name.length === 0) {
            return res.status(400).send({ message: "No tags" });
        }
        const existing = await db.query('select * from tags where tag_name=$1', [t_name]);
        if (existing.rows.length > 0) {
            return res.status(200).send(existing.rows[0]);
        }
        const new_tag = await db.query('insert into tags (tag_name) values($1) returning *', [t_name]);
        return res.status(201).send(new_tag.rows[0]);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong!" });
    }
});

router.get('/',authenticate,async(req,res)=>{
    try{
        const taggs = await db.query('select * from tags');
        return res.status(200).send(taggs.rows);
    }
    catch(error){
        console.log(error);
        res.status(500).send({message:"Something went wrong!"});
    }
});

module.exports = router;