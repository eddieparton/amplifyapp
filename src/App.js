import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';

const initialFormState = { name: '', description: '' }

function App() {

  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    //uses the API class to send a query to the GraphQL API and retrieve a list of notes.
    const apiData = await API.graphql({ query: listNotes });
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    /*
    also uses the API class to send a mutation to the GraphQL API,
    the main difference is that in this function we are passing in the variables needed for a GraphQL mutation so that we can create a new note with the form data.
    */
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    // Like createNote, this function is sending a GraphQL mutation along with some variables, but instead of creating a note we are deleting a note.
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }

  return (
    /*
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>We now have Auth!</h1>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <AmplifySignOut />
    </div>
    */

   <div className="App">
   <h1>My Notes App</h1>
   <input
     onChange={e => setFormData({ ...formData, 'name': e.target.value})}
     placeholder="Note name"
     value={formData.name}
   />
   <input
     onChange={e => setFormData({ ...formData, 'description': e.target.value})}
     placeholder="Note description"
     value={formData.description}
   />
   <button onClick={createNote}>Create Note</button>
   <div style={{marginBottom: 30}}>
     {
       notes.map(note => (
         <div key={note.id || note.name}>
           <h2>{note.name}</h2>
           <p>{note.description}</p>
           <button onClick={() => deleteNote(note)}>Delete note</button>
         </div>
       ))
     }
   </div>
   <AmplifySignOut />
 </div>

  );
}

//export default App;
export default withAuthenticator(App);
