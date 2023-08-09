import React, { useState } from "react";
import "./UserData.css";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Support from "@material-ui/icons/ReportProblem"
import HeartIcon from "@material-ui/icons/FavoriteBorder";
// import HeartActiveIcon from "@material-ui/icons/Favorite";
import HomeIcon from "@material-ui/icons/Home";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { toast } from 'react-toastify';
import { login } from "../redux/loginSlice";
import { cartItemslocalStorageToDatabaseDetails, emptyLocalStorageCartItems } from "../redux/localStorageToDatabaseSlice";
import { resetAddItemToCart } from "../redux/addItemToCartSlice";
import { resetAddItemToFavourite } from "../redux/addItemToFavouriteSlice";
import { emptyLocalStorageFavouriteItems, favouriteItemslocalStorageToDatabaseDetails } from "../redux/favouriteLocalStorageToDatabaseSlice";
import axios from "axios";

const UserData = ({ user }) => {
  const { totalQuantity: cartItems } = useSelector((state) => state.addItemToCart);
  const { totalQuantity: favouriteItems } = useSelector((state) => state.addItemToFavourite);

  const [open, setOpen] = useState(false);
  const history = useNavigate();
  console.log("Useeer", user);
  const scroolEffect = useRef(null);

  window.addEventListener("scroll", () => {
    const speedDial = document.querySelector(".speedDial");
  
    if (speedDial) {
      if (window.pageYOffset > 100) {
        speedDial.classList.add("active");
      } else {
        speedDial.classList.remove("active");
      }
    }
  });

  const dispatch = useDispatch();

  const options = [
    { icon: <DashboardIcon />, name: "Dashboard", func: dashboard, },
    { icon: <HomeIcon />, name: "Home", func: home },
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    {
      icon: (
        <ShoppingCartIcon
        style={{
         color: cartItems === 0 ? "" : "tomato",
        }}
        />
      ),
      name: `Cart (${cartItems})`,
      func: cart,
    },
    {
      icon:
          <HeartIcon 
          style={{
            color: favouriteItems === 0 ? "" : "tomato",
           }}
          />,
      name: `Favourite (${favouriteItems})`,
      func: favourite,
    },
    { icon: <PersonIcon />, name: "Profile", func: account },
    { icon: <Support />, name: "Report us", func: report },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  function dashboard() {
    history("/dashboard");
  }
  function home() {
    history("/");
  }
  function orders() {
    history("/me/orders");
  }
  function cart() {
    history("/cart");
  }
  function favourite() {
    history("/favourites");
  }
  function account() {
    history("/me");
  }

  function report() {
    history("/support");
  }

  function logoutUser() {
    const cartItems = localStorage.getItem("cartList") !== null ? JSON.parse(localStorage.getItem("cartList")) : [];
    const data = { "cartItems": cartItems };
    const favouriteItems = localStorage.getItem("favouriteList") !== null ? JSON.parse(localStorage.getItem("favouriteList")) : [];
    const data2 = { "favouriteItems": favouriteItems };

    dispatch(cartItemslocalStorageToDatabaseDetails(data)).then((response) => {
      const keys = Object.keys(response.payload);
      if(keys.includes("error")) {
        toast.error(response.payload.error);
      } else {
        dispatch(emptyLocalStorageCartItems());
        dispatch(resetAddItemToCart());
        dispatch(favouriteItemslocalStorageToDatabaseDetails(data2)).then((response) => {
          const keys = Object.keys(response.payload);
          if(keys.includes("error")) {
            toast.error(response.payload.error);
          } else {
            axios.get('/api/v2/logout').then((response) => {
              dispatch(emptyLocalStorageFavouriteItems());
              dispatch(resetAddItemToFavourite());
              dispatch(login());
              toast.success("Logout Successfully");
            })
          }
        })
      }
    });
  }

  return (
    <>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ zIndex: "11" }}
        open={open}
        direction="down"
        className="speedDial"
        useRef={scroolEffect}
        icon={
          <img
            className="speedDialIcon"
            src={(user.data.avatar && user.data.avatar.url ? user.data.avatar.url : ("/profile.png"))}
            alt="Profile"
            style={{
              position:"fixed"
            }}
          />
        }
      >
        {options.map((item) => (
          (item.name === "Dashboard" && user.data.role !== "admin" && user.data.role !== "Creator") ? null : 
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={false}
          />
        ))}
      </SpeedDial>
    </>
  );
};

export default UserData;