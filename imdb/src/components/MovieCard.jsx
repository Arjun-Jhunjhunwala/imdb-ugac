import {doc, deleteDoc, collection, where, getDocs, query } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase-config";
import { useAuth } from "../contexts/AuthContext";

export const MovieCard = ({ movie,fetchMovies }) => {

  const [id, setId] = useState(null);
  const {currentUser} = useAuth();
  const [username, setUsername] = useState();

  useEffect(() => { async function getUID () {
    try{
      const querySnapshot = await getDocs(query(collection(db,'movies'), where("title","==",movie.title)));
      if (!querySnapshot.empty){
        setId(querySnapshot.docs[0].id);
      }
    }catch(err){
      console.log(err.message)
    }
  }
  getUID();} ,[movie.title]);

  async function onDeleteClick (e) {
    e.preventDefault();
    try{
      await deleteDoc(doc(db, 'movies', id))
      fetchMovies();
    }catch(err){
      return console.log(err.message);
    }
    
  }

  useEffect(() => {
    async function getUsername() {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, "users"),
            where("email", "==", currentUser.email)
          )
        );
        if (!querySnapshot.empty)
          setUsername(querySnapshot.docs[0].data().username);
      } catch (err) {
        console.log(err.message);
      }
    }
    getUsername();
  }, [currentUser]);

  return (
    
    <div className="shadow-xl w-80 bg-black rounded-xl my-1 flex duration-300 hover:scale-105" data-aos="fade-up">
      <div className="relative flex-shrink-0">
      <Link to={`/details/${id}`} >
        <img
          className="w-40 h-60 rounded-l-xl text-white"
          src={movie.image}
          alt={movie.title}
        ></img></Link>
      </div>
      <div className="flex flex-col px-4 py-3 justify-between">
        <div className="gap-4">
          <div className=" text-white text-xl ">
          <Link to={`/details/${id}`} >{movie.title}</Link></div>
          <div>
            <p className="text-white text-xs">{movie.release}</p>
            <p className="text-white flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-amber-300">
                star
              </span>
              <span className="text-sm">{movie.rating}</span>
            </p>
          </div>
        </div>
        <div>
          <div>
            {
              username === "admin" && <Link to={`/edit/${id}`}>
              <button className="w-32 rounded my-1 flex justify-start items-center bg-amber-400 hover:bg-amber-500">
                <span className="material-symbols-outlined w-5 ml-1">edit</span>
                <span className="font-sans pl-8 text-sm py-0.5">Edit</span>
              </button>
              </Link>
            }
            
          </div>
          <div>
            { username === "admin" &&
            <button onClick={(e) => onDeleteClick(e)} className="bg-red-600 w-32 rounded flex justify-start items-center hover:bg-red-700">
              <span className="material-symbols-outlined w-5 ml-1">delete</span>
              <span className="font-sans pl-5 text-sm py-0.5">Remove</span>
            </button>
}
          </div>
        </div>
      </div>
    </div>
    
  );
};
