import { Navbar } from "../components/Navbar";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase-config";
import { setDoc, doc, where, collection, query, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const Signup = () => {
  const emailRef = useRef();
  const usernameRef = useRef();
  const passRef = useRef();
  const confirmPassRef = useRef();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');

  async function onSignupClick(e) {
    e.preventDefault();
    setError('');
    if(!(passRef.current.value) || !(confirmPassRef.current.value) || !(emailRef.current.value) || !(usernameRef.current.value)){
      return setError("Fill all fields")
    } 
    if (passRef.current.value !== confirmPassRef.current.value) {
      return setError('Passwords do not match')
    }
    const querySnapshot = await getDocs(query(collection(db,'users'), where("username","==",usernameRef.current.value)));
    if (!querySnapshot.empty){
      return setError("Username not available")
    }
    try {
      const cred = await signup(emailRef.current.value, passRef.current.value);
      await setDoc(doc(db, 'users', cred.user.uid ),{username: usernameRef.current.value, email: emailRef.current.value});
      navigate('/login');
    } catch (err) {
      switch (err.code){
        case 'auth/invalid-email':
          setError("Invalid email");
          break;
        case 'auth/email-already-in-use':
          setError("Email already signed up")
          break;
        default:
          setError("Failed to sign up");
          break;
      }
    }
  }

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center justify-center">
        <h3 className="text-2xl pt-6 text-gray-700 font-bold">
          Create an account
        </h3>
        <br />
        <form>
          <div className="w-80">
            <label
              for="login-email"
              className="block mt-4 mb-2 text-left text-gray-700 font-bold"
            >
              Email
            </label>
            <input
              type="email"
              id="login-email"
              autoComplete="off"
              ref={emailRef}
              className="block w-full mb-6 px-4 py-2 border text-gray-700 text-sm border-gray-300 focus:outline-none focus:border-amber-400"
              required
            ></input>
          </div>
          <div className="w-80">
            <label
              for="login-username"
              className="block mt-4 mb-2 text-left text-gray-700 font-bold"
            >
              Username
            </label>
            <input
              type="text"
              autoComplete="off"
              id="login-username"
              ref={usernameRef}
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
          <div>
            <label
              for="login-confirm-password"
              className="block mt-4 mb-2 text-left text-gray-700 font-bold"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="login-confirm-password"
              ref={confirmPassRef}
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
            <button
              type="submit"
              onClick={(e) => {
                onSignupClick(e);
              }}
              className=" block w-full bg-amber-400 py-2 px-10 rounded-md cursor-pointer text-black font-bold hover:bg-amber-300"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-sm text-gray-700 mb-6 mt-1">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-400 hover:text-amber-200">
            Login
          </Link>
        </p>
      </div>
    </>
  );
};
