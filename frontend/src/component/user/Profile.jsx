import { React, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom'
// import Footer from "../../Footer";
// import Header from "../Home/Header";
import MetaData from "../../more/MetaData";
// import Loading from "../../more/Loader";
import "./Profile.css";
import StatusCode from "../../redux/StatusCode";
import BottomTab from "../../more/BottomTab";

const Profile = () => {
    const history = useNavigate();
    console.log("Inside Profile");
    const { data: user, status, isAuthenticated } = useSelector((state) => state.login);
    console.log("Profile Data", user);

    useEffect(() => {
        if (isAuthenticated === false) {
            history("/login");
        }
    }, [history, isAuthenticated]);

    if(status === StatusCode.LOADING) {
        return <p>Loading...</p>
    }

    if(status === StatusCode.ERROR) {
        return <p>Something went wrong! try again later</p>
    }

    return (
        <>
       {/* {loading ? (<Loading />):( */}
        <>
        {/* <Header /> */}
        <div>
            <MetaData title={`${user.data.name}'s profile`} />
            <div className="profileContainer">
                <div style={{
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    flexDirection:"column"
                }}>
                    <h1 style={{
                        fontFamily: "Poppins,sans-serif",opacity:"1",
                        fontSize:"2vmax"
                    }}>My Profile</h1>
                    <img src={user.data.avatar ? user.data.avatar.url : ""} alt={user.data.name} className="profile__img" />
                    <Link to="/me/profile/update" className="edit__profile">Edit Profile</Link>
                </div>
            </div>
            <div className="information">
                <div className="middle">
            <div className="info">
                <h4 style={{
                    padding:"0px 5px"
                }}>Full Name:</h4>
                <p>{user.data.name}</p>
            </div>
            <div className="info">
                <h4 style={{
                    padding:"0px 5px"
                }}>Email:</h4>
                <p>{user.data.email}</p>
            </div>
            <div className="info">
            <h4 style={{
                    padding:"0px 5px"
                }}>Joined On:</h4>
            <p>{String(user.data.createdAt).substr(0,10)}</p>
            </div> 
               
              <div className="change__info">
                  <Link to="/orders" className="settings">My Orders</Link>
                  <Link to="/me/password/update" className="settings">Change Password</Link>
              </div>
        </div>  
        </div>
        </div>
        {/* <Footer /> */}
        <BottomTab />
        </>
       {/* )} */}
       </>
    )
}

export default Profile;