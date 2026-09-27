import { useState } from "react";
function Signup(props){
    const[username,SetUsername]=useState('');
    const[password,setPassword]=useState('');
    const[error,setError]=useState('');
    const[success,setSuccess]=useState('');
    return(
        <form className="form-box" onSubmit={(e)=>{
            e.preventDefault();
            fetch('http://localhost:3000/auth/signup',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({user_name:username,password:password})
            })
                .then(response=>response.json())
                .then(data =>{
                    if(data.user){
                 //console.log(data);
                 setSuccess("Account created! Please log in.");
                 setTimeout(()=>props.onSignupSuccess(),1500);
                    }
                    else{
                        setError(data.message);
                    }
                });
            }}>
             <h2>Create an account</h2>
      <p>Sign up to start taking notes</p>
      <input 
      type="text"
      value={username}
      onChange={(e)=> SetUsername(e.target.value)}
      placeholder="Username"
       />
       <input 
       type="password" 
       value={password}
       onChange={(e)=>setPassword(e.target.value)}
        placeholder="Password"
        />
        <button type="submit">Sign Up</button>
        {error && <p style={{color:'red'}}>{error}</p>}
        {success && <p style={{color:'green'}}>{success}</p>}
        </form>
    );
}
export default Signup;