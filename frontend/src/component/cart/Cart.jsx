import React from "react";
import "./Cart.css";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link } from "react-router-dom";
import CartItemCard from "./CartItemCard";
import BottomTab from "../../more/BottomTab";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { decreaseProductQuantity, increaseProductQuantity } from "../../redux/addItemToCartSlice";
import MetaData from "../../more/MetaData";

const Cart = () => {
  const dispatch = useDispatch();
  const history = useNavigate();

  const { items: cartItems, totalAmount: totalPrice } = useSelector((state) => state.addItemToCart);

  const increaseQuantity = (product) => {
    if (product.stock <= product.quantity) {
      toast.error("Product Stock Limited");
      return;
    }
    dispatch(increaseProductQuantity(product));
  };

  const decreaseQuantity = (product) => {
    if (1 >= product.quantity) {
      return;
    }
    dispatch(decreaseProductQuantity(product));
  };

  const checkoutHandler = () => {
    history("/shipping")
  };

  return (
    <>
      <MetaData title={"Cart"}/>
      {!cartItems || (cartItems && cartItems.length === 0) ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon />
          <Typography>No Items In Cart</Typography>
          <Link to="/products">View Products</Link>
          <BottomTab />
        </div>
      ) : (
        <>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>

            {cartItems &&
              cartItems.map((item) => (
                <div className="cartContainer" key={item._id}>
                  <CartItemCard item={item}/>
                  <div className="cartInput">
                    <button onClick={() => decreaseQuantity(item)}>-</button>
                    <input type="number" readOnly value={item.quantity} />
                    <button onClick={() => increaseQuantity(item)}>+</button>
                  </div>
                  <p className="cartSubtotal">{`$${item.price * item.quantity}`}</p>
                </div>
              ))}

            <div className="cartGrossProfit">
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Price Total</p>
                <p>$ {totalPrice}</p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick={checkoutHandler}>Check Out</button>
              </div>
            </div>
          </div>
          <BottomTab />
        </>
      )}
    </>
  );
};

export default Cart;