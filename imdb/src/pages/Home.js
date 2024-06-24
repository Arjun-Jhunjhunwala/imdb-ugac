import { Navbar } from "../components/Navbar";
import { MovieCard } from "../components/MovieCard";
import { getDocs, collection, where, query } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "../firebase-config";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import aos from "aos";
import 'aos/dist/aos.css'

export const Home = () => {
    const [movies, setMovies] = useState([]);
    const {currentUser} = useAuth();
    const [username, setUsername] = useState();

    useEffect(() =>{
      aos.init({duration: 1000});
    },[])

    async function fetchMovies() {
        try {
            const querySnapshot = await getDocs(collection(db, 'movies'));
            const movieList = [];
            querySnapshot.forEach(doc => movieList.push(doc.data()));
            setMovies(movieList);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        fetchMovies();
    }, []);

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
        <>
            <Navbar />
            {
                currentUser &&
                <div className="flex gap-2 flex-wrap justify-center mx-1">
                {
                    movies.length > 0 && (
                        movies.map(movie => <MovieCard data-aos="fade-up" movie={movie} fetchMovies={fetchMovies} />)
                    )
                }
                { username === "admin" &&
                <Link to='/add'>
                 <button data-aos="fade-up" className="rounded-xl bg-gray-200 hover:bg-gray-300 hover:scale-105 duration-300 my-1 add-btn flex justify-center items-center"><span className="material-symbols-outlined text-lg">add</span></button>
                </Link>
                }
                </div>
                
            }   
            
        </>
    )
};
