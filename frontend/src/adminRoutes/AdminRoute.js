import { useEffect } from 'react';
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from "react-router-dom";

const AdminRoute = () => {
    const { isAuthenticated, data: userData } = useSelector((state) => state.login);
    const user = userData.data;
    console.log(isAuthenticated);
    console.log(user);
    const history = useNavigate();

    useEffect(() => {
        if (isAuthenticated === false || user.role !== "admin") {
            history("/");
        }
    }, [history, isAuthenticated, user]);

    return (
        <>
            {isAuthenticated && user.role === "admin" ? (
                <Outlet />  // Render the child routes if the user is authenticated && admin.
            ) : (
                console.log("ERRORRR")
            )}
        </>
    );

}

export default AdminRoute;