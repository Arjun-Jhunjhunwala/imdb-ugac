import { Link } from "react-router-dom";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "../firebase-config";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  async function onSignout(e) {
    e.preventDefault();
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
      <header className="bg-neutral-950">
        <div className="flex justify-between items-center border-b border-white">
          <div className="px-10 py-3">
            <Link to='/'><img
              className=" w-20"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/1200px-IMDB_Logo_2016.svg.png"
              alt="IMDB"
            /></Link>
          </div>
          <nav>
            
            { !currentUser && <>
            <Link
              className="text-gray-50	font-sans hover:text-black hover:py-1.5 hover:bg-amber-400 hover:rounded-full duration-300 px-3 mr-1"
              to="/signup"
            >
              Signup
            </Link>
            <Link
              className="text-gray-50	font-sans hover:text-black hover:py-1.5 hover:bg-amber-400 hover:rounded-full duration-300 px-3 mr-9"
              to="/login"
            >
              Login
            </Link>
            </>
}
{ currentUser &&
            <button
              onClick={(e) => onSignout(e)}
              className="text-gray-50  hover:text-black hover:py-1.5 hover:bg-amber-400 hover:rounded-full duration-300 mr-9 px-3"
            >
              Logout
            </button>
}
          </nav>
        </div>
      </header>
    </>
  );
};
