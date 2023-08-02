// import React,{useState,useEffect} from 'react';
import { Link} from 'react-router-dom';
import "./FavouriteItemsCard.css";
import { useDispatch, useSelector } from "react-redux";
import { removeProductInFavourite } from '../../redux/addItemToFavouriteSlice';
// import ProductCard from '../Product/ProductCard';

const FavouriteItemsCard = ({ item }) => {
    console.log("ITEMS", item);
    const dispatch = useDispatch();
    const { data: product} = useSelector((state) => state.products);

    const deleteFavouriteItems = () => {
      dispatch(removeProductInFavourite(item));
    };

    return (    
        <div className='FavouriteItemsCard'>
        <div>
        <img src={item.image} alt="ssa" />
        <p onClick={() => deleteFavouriteItems()}>Remove</p>
        <Link to={`/product/${item._id}`} style={{
            fontSize:"300 0.9vmax",
            fontFamily:"cursive",
        }}>{item.name}</Link>
        </div>

        <div>
            <span>{`$ ${item.price}`}</span> 
        </div>

        <div>
        <p style={{ paddingBottom: ".5vmax" }}>
              <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                {product.Stock < 1 ? "OutOfStock" : "InStock"}
              </b>
            </p>
        </div>
        
        <div>
            <Link to={`/product/${item._id}`}>
                <button className='favouritesButton' onClick={() => deleteFavouriteItems()}>Add To Cart</button>
            </Link>
        </div>

    </div>
    )
}

export default FavouriteItemsCard;