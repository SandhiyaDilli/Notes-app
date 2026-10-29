import { useState } from 'react';
import CreateNote from './CreateNote';
import Login from './Login';
import NotesList from './NotesList';
import './App.css';
import Signup from './Signup';

function App(){
  const [refreshTrigger,setRefreshTrigger]=useState(0);
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
    <CreateNote onNoteCreated={()=>setRefreshTrigger(prev=>prev+1)}/>
    <NotesList refreshTrigger={refreshTrigger} onEdit={()=>setRefreshTrigger(prev=>prev+1)}/>
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

  