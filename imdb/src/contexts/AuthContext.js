import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [currentUser, setCurrentUser] = useState();

    function signup(email, password){
        return createUserWithEmailAndPassword(auth,email,password)
    }

    function login(email,password){
        return signInWithEmailAndPassword(auth, email, password)
    }

    useEffect(() => auth.onAuthStateChanged(user => {
        setCurrentUser(user)
    }),[])

    

    const value = {
        currentUser,
        signup,
        login
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);