import { useEffect } from 'react'
import Navbar from "../components/Navbar"
import RateLimitedUI from '../components/RateLimitedUI'
import NoteCard from "../components/NoteCard";
import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/axios';
import NotesNotFound from '../components/NotesNoteFound';

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetechNotes = async () => {
      try {
        const res = await api.get("/notes")
        console.log(res.data)
        setNotes(res.data);
        setIsRateLimited(false)
      } catch (error) {
        console.log("Error fetching notes:")
        console.error(error);
        if(error.response?.status === 429) {
          setIsRateLimited(true);
        } else{
          toast.error("Failed to load notes.")
        }
      } finally {
        setLoading(false);
      }
    }

    fetechNotes();
  }, [])

  return (
    <div className='min-h-screen'>
        <Navbar />
        {isRateLimited && <RateLimitedUI />}

        <div className='max-w-7xl mx-auto p-4 mt-6'>
          {loading && <div className='text-center text-primary py-10'>Laoding notes...</div>}

          {notes.length === 0 && !isRateLimited && <NotesNotFound />}

          {notes.length > 0 && !isRateLimited && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'> 
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} setNotes={setNotes}/>
              ))}
            </div>
          )}
        </div>
    </div>
  )
}

export default HomePage