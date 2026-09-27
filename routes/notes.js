const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticate = require('../middleware/auth');//why no .js here

router.get('/test', authenticate, (req, res) => {
   res.send({ message: "Authenticated!", u_id: req.u_id });
});


router.post('/', authenticate, async (req, res) => {
   try {
      const { note } = req.body;
      if (!note || note.length === 0) {
         return res.status(400).send({ message: "Not a valid note" });
      }
      const result = await db.query(
         'insert into notes (note,u_id) values ($1,$2) returning *', [note, req.u_id]);
      res.status(201).send(result.rows[0]);
   }
   catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
   }
});


router.get('/', authenticate, async (req, res) => {
   try {
      const notes = await db.query('select note_id,note from notes where u_id = $1', [req.u_id]);
      if (notes.rows.length === 0) {
         return res.status(200).send({ message: "Create our first note!" });//or return empty array-but how .send([])
      }
      return res.status(200).send(notes.rows);
   }
   catch (error) {
      console.log(error);
      res.status(500).send({ message: "Failed to fetch notes" });
   }
});


router.get('/with-tags',authenticate,async(req,res)=>{
try{
const checking =await db.query(`select n.note_id,n.note, STRING_AGG(t.tag_name,',')AS Tags from notes n left join note_tags nt on n.note_id = nt.note_id left join tags t on t.tag_id = nt.tag_id where n.u_id=$1 group by n.note_id,n.note`,[req.u_id]);
if(checking.rows.length === 0){
   return res.status(404).send({message:"No Notes"});
}
return res.status(200).send(checking.rows);
}
catch(error){
   console.log(error);
   return res.status(500).send({message:"Something went wrong!"});
}
});

router.get('/:note_id', authenticate, async (req, res) => {
   try {
      const noteId = req.params.note_id;
      const result = await db.query('select note_id,note from  notes where note_id=$2 and u_id=$1', [req.u_id, noteId]);
      if (result.rows.length === 0) {
         return res.status(404).send({ message: "No note found!" });
      }
      return res.status(200).send(result.rows);
   }
   catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong!" })
   }
});


router.patch('/:note_id', authenticate, async (req, res) => {
   try {
      const { note } = req.body;
      const noteId = req.params.note_id;
      //  const note1 = await db.query('select resultfrom notes where note_id=$1 and u_is=$2',[noteId,req.u_id]);
      const result = await db.query('update notes set note=$2, updated_on = current_timestamp where note_id =$1 and u_id=$3 returning *', [noteId, note, req.u_id]);//--why not returning
      if (result.rows.length === 0) {
         return res.status(404).send({ message: "No not found" });
      }
      return res.status(200).send(result.rows);
   }
   catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong!" });
   }
});


router.delete('/:note_id', authenticate, async (req, res) => {
   try {
      const noteId = req.params.note_id;
      const result = await db.query('delete from notes where note_id=$1 and u_id=$2 returning *', [noteId, req.u_id]);
      if (result.rows.length === 0) {
         return res.status(404).send({ message: "No note found" });
      }
      return res.status(200).send({ message: "Note deleted!" })
   }
   catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong!" });
   }
});


router.post('/:note_id/tags',authenticate,async(req,res)=>{
   try{
      const noteId=req.params.note_id;
      const {tag_id}=req.body;
      const checkNote = await db.query('select * from notes where note_id=$1 and u_id=$2',[noteId,req.u_id]);
      if(checkNote.rows.length === 0){
         return res.status(404).send({message:"No note found"});
      }
      const dupe = await db.query('select * from note_tags where note_id = $1 and tag_id =$2',[noteId,tag_id]);
      if(dupe.rows.length > 0){
         return res.status(200).send({message:" Note and tag already exists!"});
      }
      const result = await db.query('insert into note_tags (note_id,tag_id) values ($1,$2) returning *',[noteId,tag_id]);
      return res.status(201).send(result.rows[0]);
   }
   catch(error){

      // Postgres gives a specific error code for "duplicate key violation": 23505
      //more efficient becoz unlike the above approach it doesnt go
      //  and check every time(even if is new it will check bit inefficient)
      //it kust throws error code when failed
      // if (error.code === '23505') {
      // return res.status(200).send({ message: "Tag already attached to this note" });
      // }

      console.log(error);
      return res.status(500).send({message:"Something went wrong!"});
   }
});


router.delete('/:note_id/tags/:tag_id',authenticate,async(req,res)=>{
   try{
    const noteId = req.params.note_id;
    const tagid = req.params.tag_id;
    const check = await db.query('select * from notes where note_id=$1 and u_id=$2', [noteId, req.u_id]);
    if(check.rows.length===0){
      return res.status(404).send({message:"No note found"});
    }
    const del = await db.query('delete from note_tags where note_id =$1 and  tag_id = $2  returning *',[noteId,tagid]);
    //return res.status(200).send({message:"tageleted sucussefully!"})
     if(del.rows.length===0){
      return res.status(404).send({message:"Tag was not attached for this note"});
     }
      return res.status(200).send({message:"Tag deleted!"});
   }
   catch(error){
   console.log(error);
   return res.status(500).send({message:"Something went wrong!"});
   }
});


module.exports = router;



















