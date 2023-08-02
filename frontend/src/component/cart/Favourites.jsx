import React from 'react';
import "./Favourites.css";
import { useSelector } from "react-redux";
// import {deleteFavouriteItemsToCart, deleteOfferFavouriteItemsToCart} from "../../actions/FavouriteAction"
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/FavoriteBorder";
import { Link } from "react-router-dom";
import FavouriteItemsCard from './FavouriteItemsCard.jsx';
import MetaData from '../../more/MetaData';
// import Loading from '../../more/Loader';
// import { useState } from "react";
import BottomTab from '../../more/BottomTab';

const Favourites = ({history}) => {
    // const dispatch = useDispatch();

    // const {loading} = useSelector(
    //   (state) => state.productDetails
    // );
    const { items: favouriteItems } = useSelector((state) => state.addItemToFavourite);
  
    //   const deleteFavouriteItems = (product) => {
    //     dispatch(deleteFavouriteItemsToCart(id));
    //   };
    
    return (
       <>
       {/* {loading ? (
         <Loading />
       ) : ( */}
        <>
        <MetaData title="Favourites" />
        {favouriteItems.length === 0 ? (
            <div className="emptyCart">
            <RemoveShoppingCartIcon />
            <Typography>No Items In Favourites</Typography>
            <Link to="/products">View Products</Link>
          <BottomTab />
          </div>
        ): (
            <>
              <div className="favouritesPage">
                <div className="favouritesHeader">
                  <p>Product</p>
                  <p>Price</p>
                  <p>Stock Status</p>
                  <p>Action</p>
                </div>
                {favouriteItems &&
                favouriteItems.map((item) => (
                    <div className="favouritesContainer" key={item._id}>
                        <FavouriteItemsCard item={item} />
                    </div>
                ))
                }
             <BottomTab />
              </div>
            </>
        )}
        </>
       {/* )} */}
       </>
    )
}

export default Favourites;