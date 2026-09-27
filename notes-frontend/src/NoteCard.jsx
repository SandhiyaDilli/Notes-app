import {useState} from "react";
function NoteCard(props){
    //state variable - spl var in react and any change in that var would 
    //tell react to refresh the screen when its value changes.

    //useState - hook and it automatically triggers re-renders
    //  of pages once the useState variables are changed or edited
    const [isEditing,setIsEditing] = useState(false);
    const [editedNote,setEditedNote] = useState(props.note);
    const [newTag,setNewTag] = useState('');
    const handelTag =() =>{
        const token = localStorage.getItem('token');
        fetch('http://localhost:3000/tags',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${token}`
            },
            body:JSON.stringify({t_name:newTag})
        })
        .then(response=>response.json())
        .then(tagData=>{
            fetch(`http://localhost:3000/notes/${props.note_id}/tags`,{
                method:'POST',
                headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${token}`
                },
                body:JSON.stringify({tag_id:tagData.tag_id})
        })
        .then(()=>{
            setNewTag('');
            props.onEdit();
});
        });
    };
    const handleSave = () =>{
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/notes/${props.note_id}`,{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json',
                Authorization : `Bearer ${token}`
            },
            body : JSON.stringify({note:editedNote})
        })
        .then(response =>{
            if(!response.ok) throw new Error('Failed to update note');
            return response.json();
        })
        .then(() =>{
            setIsEditing(false);
            props.onEdit();
        });
    };
    return(
        <div className="note-card">
        {isEditing ? (
            <input type="text" value={editedNote} onChange={(e)=>setEditedNote(e.target.value)}/>)
             :
              <h3>{props.note}</h3>
              }
        <div className="note-tags">
            {props.tags && props.tags.split(',').map((tag,i) =>(
                <span key={i} className="tag-pill">{tag}</span>
                ))}
        </div>
        {/* <p>{props.tags}</p> */}
        <div className="note-actions">
        <button onClick={()=>props.onDelete(props.note_id)}>Delete</button>
        <button onClick={()=> setIsEditing(true)}>Edit</button>
        {isEditing && <button onClick={handleSave}>Save</button>}
        </div>
        <div className="tag-input-row">
        <input 
        type="text"
        value={newTag}
        onChange={(e)=> setNewTag(e.target.value)}
        placeholder="Add a tag" />
        <button onClick={handelTag}>Add Tag</button>
        </div>
        </div>
    );
}
export default NoteCard;