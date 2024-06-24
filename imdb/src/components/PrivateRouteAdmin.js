import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDocs, collection, where, query } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "../firebase-config";
import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";

export const PrivateRouteAdmin = ({children}) => {

    const {currentUser} = useAuth();
    const [username, setUsername] = useState();

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

    return username === "admin" ? children:<div>Admin Access Only</div>
}