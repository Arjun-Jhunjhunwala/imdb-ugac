import { useEffect, useState } from "react";
import { where, collection, query, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "../firebase-config";
import { useAuth } from "../contexts/AuthContext";

export const ReviewCard = ({review, getReviews}) => {

    const [id, setId] = useState();
    const { currentUser } = useAuth();
    const [ username, setUsername] = useState();

    useEffect(() => {
        async function getID() {
            try{
                const querySnapshot = await getDocs(query(collection(db,'reviews'), where("movie","==",review.movie), where("username","==", review.username), where("comments","==",review.comments),where("rating","==",review.rating)));
                if (!querySnapshot.empty){
                setId(querySnapshot.docs[0].id);
        }
            }catch(err){
                console.log(err.message);
            }
        }
        getID();
    },[review])

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

    async function onDeleteClick (e) {
        e.preventDefault();
        try{
            await deleteDoc(doc(db,"reviews",id));
        }catch(err){
            return console.log(err.message);
        }
        getReviews();
    }

    return(
        <>
            <div className="mx-4">
                <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <p className="text-sm"><strong>{review.username}</strong></p>
                        { ((review.username === username) || username === "admin")&&
                        <button onClick={(e) => onDeleteClick(e)} className="ml-0.5"><span className="material-symbols-outlined text-sm">delete</span></button>
                        }   
                    </div>
                    <p className="flex items-center"><span className="text-sm">{review.rating}</span><span className="material-symbols-outlined text-amber-400">star</span></p>
                </div>
                <div className="text-xs mx-2 text-justify">
                {review.comments}
                </div>
            </div>
        </>
    )
}