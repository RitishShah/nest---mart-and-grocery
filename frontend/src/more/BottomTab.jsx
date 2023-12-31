// eslint-disable-next-line
import React from "react";
import "./BottomTab.css";
import { Link } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from '@material-ui/icons/Search';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import PersonIcon from '@material-ui/icons/Person';
import DehazeIcon from '@material-ui/icons/Dehaze';
import { useSelector } from "react-redux";

const BottomTab = () => {
    const { isAuthenticated} = useSelector((state) => state.login);
    const { totalQuantity: cartItemsCount } = useSelector((state) => state.addItemToCart);
    const { totalQuantity: favouriteItemsCount } = useSelector((state) => state.addItemToFavourite);

    return (
    <>
    <div className="bottomOption">
        <Link to="/">
        <HomeIcon  
        style={{
            color:"#000",
            fontSize:"35px",
            margin:"5px",
            opacity:".8"
        }}
        />
        </Link>
        <Link to="/search">
        <SearchIcon 
        style={{
        color:"#000",
        fontSize:"35px",
        margin:"5px"
        }}
        />
        </Link>
        <Link to="/cart">
        <div style={{
            position:"relative"
        }}>
        <LocalMallIcon 
            style={{
            color:"#000",
            fontSize:"35px",
            margin:"5px",
            opacity:".8"
        }} 
        />
        <span style={{
            position:"absolute",
            bottom:"70%",
            left:"10%",
            height:"20px",
            width:"20px",
            border:"none",
            background:"tomato",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            borderRadius:"50%",
            color:"#fff",
            fontWeight:"700"
        }}>{cartItemsCount}</span>
        </div>
        </Link>
        <Link to="/favourites">
        <div style={{
            position:"relative"
        }}>
        <FavoriteBorderIcon 
        style={{
            color:"#000",
            fontSize:"35px",
            margin:"5px",
            opacity:".8",
        }} 
        />
        <span style={{
            position:"absolute",
            bottom:"70%",
            left:"10%",
            height:"20px",
            width:"20px",
            border:"none",
            background:"tomato",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            borderRadius:"50%",
            color:"#fff",
            fontWeight:"400",
        }}>{favouriteItemsCount}</span>
        </div>
        </Link>
        {isAuthenticated ?
            <Link to="/me">
                <PersonIcon 
                style={{
                color:"#000",
                fontSize:"35px",
                margin:"5px",
                opacity:".8"
                }}
                />
            </Link> :
            <Link to="/login">
                <PersonIcon 
                style={{
                color:"#000",
                fontSize:"35px",
                margin:"5px",
                opacity:".8"
                }}
                />
            </Link>
        }
        <Link to="/more">
            <DehazeIcon style={{
                color:"#000",
                fontSize:"35px",
                margin:"5px",
                opacity:".8"
            }} />
        </Link>
    </div>
    </>
    );
};

export default BottomTab;