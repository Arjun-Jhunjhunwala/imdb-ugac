import { Navbar } from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRef, useState } from "react";
import { db } from "../firebase-config";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const Login = () => {

    const usernameRef = useRef();
    const passRef = useRef();

    const [error, setError] = useState('');

    const navigate = useNavigate();

    const { login, currentUser } = useAuth(); 

    async function onLoginClick(e){
        e.preventDefault();
        setError('');
        try{
            const querySnapshot = await getDocs(query(collection(db,'users'), where("username","==",usernameRef.current.value)));
            if (querySnapshot.empty){
              return setError('Username not found')
            }
            const email = querySnapshot.docs[0].data().email;
            await login(email,passRef.current.value);
            navigate('/');
        }catch(err){
            setError('Incorrect Password')
            console.log(err.message);
        }
    }

  return (
    <>
      <Navbar />
      
      
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-2xl pt-6 text-gray-700 font-bold">
          Login to your account
        </h3>
        <br />
        <form>
          <div className="w-80">
            <label
              for="login-username"
              className="block mt-4 mb-2 text-left text-gray-700 font-bold"
            >
              Username
            </label>
            <input
              type="text"
              id="login-username"
              ref={usernameRef}
              autoComplete="off"
              className="block w-full mb-6 px-4 py-2 border text-gray-700 text-sm border-gray-300 focus:outline-none focus:border-amber-400"
              required
            ></input>
          </div>
          <div>
            <label
              for="login-password"
              className="block mt-4 mb-2 text-left text-gray-700 font-bold"
            >
              Password
            </label>
            <input
              type="password"
              id="login-password"
              ref={passRef}
              className="block w-full mb-6 px-4 py-2 border text-gray-700 text-sm border-gray-300 focus:outline-none focus:border-amber-400"
              required
            ></input>
          </div>
          { error &&
          <div className="flex justify-center items-center">
            <button disabled className=" block w-full bg-red-500 py-2 px-10 rounded-md mb-4 text-black font-bold">{error}</button>
          </div>
          }           
          <div className="flex justify-center items-center">
            <button type='submit' onClick={(e) => onLoginClick(e) } className=" block w-full bg-amber-400 py-2 px-10 rounded-md cursor-pointer text-black font-bold hover:bg-amber-300">Login</button>
          </div>
        </form>
        <p className="text-sm text-gray-700 mb-6 mt-1">Don't have an account? <Link to='/signup' className="text-amber-400 hover:text-amber-200">Sign Up</Link></p>
      </div>
    </>
  );
};
