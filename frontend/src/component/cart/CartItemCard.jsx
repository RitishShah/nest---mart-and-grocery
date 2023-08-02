import React from 'react';
import { Link } from 'react-router-dom';
import "./CartItemCard.css";
import { removeProductInCart } from '../../redux/addItemToCartSlice';
import { useDispatch } from 'react-redux';

const CartItemCard = ({ item }) => {
    const dispatch = useDispatch();

    const deleteCartItems = () => {
        console.log("asdadsadsad");
        dispatch(removeProductInCart(item));
    };

    return (
        <div className='CartItemCard'>
            <img src={item.images ? item.images[0] : item.images} alt="ssa" />
            <div>
                <Link to={`/product/${item._id}`}>{item.name}</Link>
                <span>{`Price: $ ${item.price}`}</span>
                <p onClick={() => deleteCartItems()}>Removed</p>
            </div>
        </div>
    ) 
}

export default CartItemCard