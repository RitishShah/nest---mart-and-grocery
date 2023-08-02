import { useEffect } from 'react';
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from "react-router-dom";
// import Footer from '../footer/Footer';

const ProtectedRoute = () => {
    const { isAuthenticated, data: user } = useSelector((state) => state.login);
    console.log(isAuthenticated);
    console.log(user);
    const history = useNavigate();

    useEffect(() => {
        if (isAuthenticated === false) {
            history("/");
        }
    }, [history, isAuthenticated]);

    return (
        <>
            {isAuthenticated ? (
                <Outlet />  // Render the child routes if the user is authenticated
            ) : (
                console.log("ERRORRR")
            )}
        </>
    );

}

export default ProtectedRoute;