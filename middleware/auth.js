const jwt = require('jsonwebtoken');
function authenticate(req,res,next){
try{
const t = req.headers.authorization;
if(t === undefined){
    return res.status(401).json({message:"Not a valid token"});
}
const tk = t.split(" ");
//console.log(tk[0]);
//console.log(tk[1]);
const decode =  jwt.verify(tk[1],process.env.JWT_SECRET)
req.u_id = decode.u_id;//sending uid from decode to routes else we can do nothing
next();//middleware approved the request ,continue with actual route
//res.status(200).send({message:"Verification successful."});-becoz middleware should not respond to success
}
catch(error){
console.log(error);
res.status(401).send({message:"Invalid!"});
}
}
module.exports=authenticate;
