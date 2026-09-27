import { useState } from "react";
function Login(props){
    const [username,setusername]=useState('');
    const [password,setpassword]=useState('');
    const[error,setError]=useState('');
    return(
        <>
        <form className="form-box" onSubmit={(e)=>{
            e.preventDefault();
            fetch('http://localhost:3000/auth/login',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body : JSON.stringify({user_name:username,password:password})
            })
            .then((response)=> response.json())
            .then((data)=>{
                if(data.token){
                //console.log(data);
                //storing the token in localStorage
                localStorage.setItem('token',data.token);
                props.onLogin(data.token);
                }
                else{
                    setError(data.message);
                }
            });
        }}>
            <h2>Welcome back</h2>
  <p>Log in to see your notes</p>
        <input
        type="text"
        value={username}
        onChange={(e)=>setusername(e.target.value)}
        />
        <input
        type="password"
        value={password}
        onChange={(e)=>setpassword(e.target.value)}
        />
        <button type="submit">Login</button>
         {error && <p style={{color:'red'}}>{error}</p>}
        </form>
        </>
    );
}

export default Login;