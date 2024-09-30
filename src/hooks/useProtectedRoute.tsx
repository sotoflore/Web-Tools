
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import Spinner from "../components/common/Spinner";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const [user, loading] = useAuthState(auth);
    if (loading) return <Spinner />;
    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
