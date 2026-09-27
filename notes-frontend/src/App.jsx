import { useState } from 'react';
import CreateNote from './CreateNote';
import Login from './Login';
import NotesList from './NotesList';
import './App.css';
import Signup from './Signup';
//notes array
const notes=["Gym","Walk","Prayer"];

//parent component
function App(){
  const [refreshTrigger,setrefershTrigger]=useState(0);
  const [token,setToken] = useState(localStorage.getItem('token'));
  const[showSignup,setShowSignup]=useState(false);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };
  return(
    <div className ="app-container">
    {token ? (
      <>
      <h1>My Notes</h1>
    <CreateNote onNoteCreated={()=>setrefershTrigger(prev=>prev+1)}/>
    <NotesList refreshTrigger={refreshTrigger} onEdit={()=>setrefershTrigger(prev=>prev+1)}/>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </>
    ) :(
      <>
      {showSignup ? 
      (<Signup onSignupSuccess={()=>setShowSignup(false)}/>)
    :
    (<Login onLogin={(newToken) =>setToken(newToken)}/>)
      }
      <button onClick={()=>setShowSignup(!showSignup)}>
      {showSignup ? "Already have an account? Log in" : "New here? Sign up"}
      </button>
      </>
  )}
  </div>
  );
}
export default App;

  //.map() - takes an array, applies an operation to each item,
  //  returns a new array. Plain JS, nothing React-specific.

  //key - acts as a permanent ID tag so React can track "which
  //  item is which" across changes (add/delete/edit), instead of 
  // relying on position which can cause mix-ups.

