import "./App.css";
import { Home } from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { AddMovie } from "./pages/AddMovie";
import { EditMovie } from "./pages/EditMovie";
import { MovieDetails } from "./pages/MovieDetails";
import { PrivateRoute } from "./components/PrivateRoute.js";
import { PrivateRouteAdmin } from "./components/PrivateRouteAdmin.js";
import { NonPrivateRoute } from "./components/NonPrivateRoute.js";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>  } />
        <Route path="/login" element={<NonPrivateRoute><Login /></NonPrivateRoute>} />
        <Route path="/signup" element={<NonPrivateRoute><Signup /></NonPrivateRoute>} />
        <Route path="/add" element={<PrivateRouteAdmin><AddMovie></AddMovie></PrivateRouteAdmin>} />
        <Route path="/edit/:id" element={<PrivateRouteAdmin><EditMovie /></PrivateRouteAdmin>} />
        <Route path="/details/:id" element={<PrivateRoute><MovieDetails /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;
