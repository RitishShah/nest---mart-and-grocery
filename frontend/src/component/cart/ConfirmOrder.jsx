import React from "react";
import "./ConfirmOrder.css";
import { useSelector } from "react-redux";
import CheckoutSteps from "./CheckoutSteps";
import MetaData from "../../more/MetaData";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@material-ui/core";
import BottomTab from "../../more/BottomTab";

const ConfirmOrder = () => {
    const history = useNavigate();
    const { items: cartItems } = useSelector((state) => state.addItemToCart);
    const { shipData: shippingDetails } = useSelector((state) => state.shippingInfo);
    const { data: userData } = useSelector((state) => state.login);
    const user = userData.data;

    console.log("Shiipings", cartItems, shippingDetails, user);
    
    let productPrice =  cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

    const subtotal = productPrice;
      // eslint-disable-next-line
    const shippingCharges = productPrice > 99 ? 0 : 50;
    
    const totalPrice = subtotal + shippingCharges;
  
    const fullAddress = `${shippingDetails.address}, ${shippingDetails.state}, ${shippingDetails.country}`;
  
    const proceedToPayment = () => {
      const data = {
        subtotal,
        shippingCharges,
        totalPrice,
      };
      console.log(data);
      sessionStorage.setItem("orderInfo", JSON.stringify(data));
      history("/process/payment");
    };
  
    return (
      <>
        <MetaData title="Confirm Order" />
        <CheckoutSteps activeStep={1} />
        <div className="confirmOrderPage">
          <div>
            <div className="confirmshippingArea">
              <Typography>Shipping Info</Typography>
              <div className="confirmshippingAreaBox">
                <div>
                  <p>Name:</p>
                  <span>{user.name}</span>
                </div>
                <div>
                  <p>Phone:</p>
                  <span>{shippingDetails.phone}</span>
                </div>
                <div>
                  <p>Address:</p>
                  <span>{fullAddress}</span>
                </div>
              </div>
            </div>
            <div className="confirmCartItems">
              <Typography>Your Cart Items:</Typography>


              {cartItems.length === 0 ? 
                <div className="confirmCartItemsContainer">
                   ""
                 </div>
                  :
             <div className="confirmCartItemsContainer">
             {cartItems.map((item) => (
               <div key={item.product}>
                 <img src={item.image} alt="Product" />
                 <Link to={`/product/${item.product}`}>
                   {item.name}
                 </Link>{" "}
                 <span>
                   {item.quantity} X ${item.price} ={" "}
                   <b>${item.price * item.quantity}</b>
                 </span>
               </div>
             ))
              }
           </div>
          }
     
            </div>
          </div>
          <div>
            <div className="orderSummary">
              <Typography>Order Summery</Typography>
              <div>
                <div>
                  <p>Subtotal:</p>
                  <span>${subtotal}</span>
                  </div>
                    <div>
                      <p>Shipping Charges:</p>
                      <span>${shippingCharges}</span>
                    </div>
                  <div>
                </div>
              </div>
  
              <div className="orderSummaryTotal">
                <p>
                  <b>Total:</b>
                </p>
                <span>${totalPrice}</span>
              </div>
                  
              <button onClick={proceedToPayment}>Proceed To Payment</button>
            </div>
          </div>
        </div>
        <BottomTab />
      </>
    );
  };
  
  export default ConfirmOrder;