require('dotenv').config();
const{Pool}=require('pg');
const pool = new Pool({
 connectionString:process.env.DATABASE_URL
});
//wrong this is a function not a variable
//module.exports(pool);

// this is variable
module.exports=pool;