import { Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';
import Header from "../Home/Header";
import Footer from "../../footer/Footer";
import UserData from "../../more/UserData";

const RootLayout = () => {
    const { isAuthenticated, data: user } = useSelector((state) => state.login);
    console.log("IsAuthenticate: ", isAuthenticated);
    console.log("user", user);
    return (
        <>
            {/* It means that if isAuthenticated is true then UserData Component will render. */}
            {isAuthenticated && <UserData user={user} />}
            <Header/>
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </>
    );
}

// So, Header is going to render at UI for all components.
// If it's dashboard then Header will shown up with dashboard.mongod
// If it's cart then Header will shown up with cart.
export default RootLayout;