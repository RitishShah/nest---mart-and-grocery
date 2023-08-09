import React, {useEffect, useRef } from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../../more/MetaData";
import { Typography } from "@material-ui/core";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import "./Payment.css";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
// import { createOrder, clearErrors } from "../../actions/OrderAction";
import { toast } from 'react-toastify';
import { orderCreateDetails } from "../../redux/orderCreateSlice";
import { useNavigate } from "react-router-dom";
import StatusCode from "../../redux/StatusCode";
import { userOrdersDetails } from "../../redux/userOrdersSlice";
import { emptyLocalStorageCartItemsAfterPaymentDone, resetAddItemToCart } from "../../redux/addItemToCartSlice";
// import 'react-toastify/dist/ReactToastify.css';
// import Loading from "../../more/Loader";

const Payment = () => {
  const history = useNavigate();
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);
  
  const { shipData: shippingInfo } = useSelector((state) => state.shippingInfo);
  const { items: cartItems } = useSelector((state) => state.addItemToCart);
  const { data: userData } = useSelector((state) => state.login);
  const user = userData.data;
  const { status, error } = useSelector((state) => state.orderCreate);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/v2/payment/process",
        paymentData,
        config
      );

      console.log("car details", data);

      const client_secret = data.data;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              country: shippingInfo.country,
            },
          },
        },
      });

      console.log("car result", result);

      if (result.error) {
        payBtn.current.disabled = false;
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          console.log("orderDetails", order);
          dispatch(orderCreateDetails(order)).then((response) => {
            const keys = Object.keys(response.payload);
            if(keys.includes("error")) {
              toast.error(response.payload);
            } else {
              toast.success("Order Created Successfully");
              dispatch(userOrdersDetails());
              dispatch(emptyLocalStorageCartItemsAfterPaymentDone());
              dispatch(resetAddItemToCart());
              history("/order/success");
            }
          })
        } else {
          toast.error("There's some issue while processing payment");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if(status === StatusCode.LOADING) {
    return <p>Loading...</p>
  }

  if(status === StatusCode.ERROR) {
    return <p>Something went wrong! try again later</p>
  }

  return (
  <>
    <MetaData title="Payment" />
    <CheckoutSteps activeStep={2} />
    <div className="paymentContainer">
      <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
        <Typography>Card Info</Typography>
        <div>
          <CreditCardIcon />
          <CardNumberElement className="paymentInput" />
        </div>
        <div>
          <EventIcon />
          <CardExpiryElement className="paymentInput" />
        </div>
        <div>
          <VpnKeyIcon />
          <CardCvcElement className="paymentInput" />
        </div>

        <input
          type="submit"
          value={`Pay - $ ${orderInfo && orderInfo.totalPrice}`}
          ref={payBtn}
          className="paymentFormBtn"
        />
      </form>
    </div>
  </>
  );
};

export default Payment;