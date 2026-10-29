const jwt = require('jsonwebtoken');
function authenticate(req,res,next){
try{
const t = req.headers.authorization;
if(t === undefined){
    return res.status(401).json({message:"Not a valid token"});
}
const tk = t.split(" ");
const decode =  jwt.verify(tk[1],process.env.JWT_SECRET)
req.u_id = decode.u_id;
next();
}
catch(error){
console.log(error);
res.status(401).send({message:"Invalid!"});
}
}
module.exports=authenticate;
