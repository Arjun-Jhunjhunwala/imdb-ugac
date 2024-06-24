import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const NonPrivateRoute = ({children}) => {

    const {currentUser} = useAuth();

    return currentUser? <Navigate to='/'/> : children
}