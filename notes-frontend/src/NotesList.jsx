import {useState,useEffect} from 'react';
import NoteCard from './NoteCard';
function NotesList(props){
    const [notes,setNotes] = useState([]);
    //useEffect - abt what to do (the logic /data fetching) not abt UI
    useEffect(()=>{
        const token = localStorage.getItem('token');
        fetch('http://localhost:3000/notes/with-tags',
            {headers:{
                Authorization:`Bearer ${token}`
            }})
            .then(response=>{
                if(!response.ok){
                    throw new Error('Failed to fetch notes');
                }
                    return response.json();
            })
            .then(data=> {setNotes(data);
                console.log(data);
    });
    },[props.refreshTrigger]);

    const handleNote =(note_id)=>{
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/notes/${note_id}`,{
            method:'DELETE',
            headers:{
                Authorization:`Bearer ${token}`}
        })
          .then(()=>{
            setNotes(notes.filter(note=>note.note_id !== note_id))
            });
    };
    return(
        <>
        {notes.map((note,index)=>(
        <NoteCard key={note.note_id} note={note.note} tags={note.tags} note_id={note.note_id} onDelete={handleNote} onEdit={props.onEdit}/>
        ))}
        </>
    );
}
export default NotesList;