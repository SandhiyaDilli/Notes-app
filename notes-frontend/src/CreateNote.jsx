import { useState } from "react";
function CreateNote(props){
    const [note,setNote]= useState('');
    return(
        <form className="form-box" onSubmit={(e)=>{
            e.preventDefault();
            const token = localStorage.getItem('token');
            fetch('http://localhost:3000/notes',{method:'POST',
                headers:{'Content-Type':'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body:JSON.stringify({note:note})
            })
            .then(response=>response.json())
            .then(()=>{
                setNote('');
                 props.onNoteCreated();
            });
            
        }}>
            <input 
            type="text" 
            value={note}
            onChange={(e)=> setNote(e.target.value)}/>
            <button type="submit">Add note</button>
            </form>
    );
}
export default CreateNote;