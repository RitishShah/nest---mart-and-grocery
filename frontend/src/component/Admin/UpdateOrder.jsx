import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../../more/MetaData";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import SideBar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { Button } from "@material-ui/core";
import "./UpdateOrder.css";
import { toast } from 'react-toastify';
import { updateOrderDetails } from "../../redux/updateOrderSlice";
import { getAllOrders } from "../../redux/allOrdersSlice";
import { clearSingleOrderDetailError } from "../../redux/singleOrderDetailSlice";
import StatusCode from "../../redux/StatusCode";

const UpdateOrder = () => {
  const history = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const { singleOrderData: order, error, status: singelOrderDetailStatus } = useSelector((state) => state.singleOrderDetail);
  console.log("order update data", order);
  const { status: updateOrderStatus } = useSelector((state) => state.updateOrder);

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();
    const data = { "status": status };
    dispatch(updateOrderDetails({id: params.id, data: data})).then((response) => {
      const keys = Object.keys(response.payload);
      if(keys.includes(keys)) {
        toast.error(response.payload.error.message);
      } else {
        toast.success("Order Updated Successfully");
        dispatch(getAllOrders());
        history("/admin/orders");
      }
    })
  };

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearSingleOrderDetailError());
    }
  }, [dispatch, history, params.id, error ]);

  if(updateOrderStatus === StatusCode.LOADING || singelOrderDetailStatus === StatusCode.LOADING ) {
    return <p>Loading...</p>
  }

  if(updateOrderStatus === StatusCode.ERROR || updateOrderStatus === StatusCode.ERROR) {
    return <p>Something went wrong! try again later</p>
  }

  return (
    <Fragment>
      <MetaData title="Process Order" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <div className="confirmOrderPage"
            style={{
              display: order ? (order.orderStatus === "Delivered" ? "block" : "grid") : "grid",
            }}
          >
            <div>
              <div className="confirmshippingArea">
                <Typography>Shipping Info :</Typography>
                <div className="sectionBox">
                  <div className="orderDetailsContainerBox">
                    <div>
                      <span>Name: </span>
                      <span>{order ? (order.user && order.user.name) : ""}</span>
                    </div>
                    <div>
                      <span>Phone: </span>
                      <span> {order ? (order.shippingInfo && order.shippingInfo.phone) : ""} </span>
                    </div>
                    <div>
                      <span>Address: </span>
                      <span>
                        {order ? (order.shippingInfo &&
                          `${order.shippingInfo.address}, ${order.shippingInfo.state}`) : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <Typography>Payment :</Typography>
                <div className="sectionBox">
                  <div className="orderDetailsContainerBox">
                    <div>
                    <span>Status: </span>
                      <span style={{
                          color:"green"
                      }}>
                        PAID
                      </span>
                    </div>

                    <div>
                      <span>Amount: </span>
                      <span>${order ? (order.totalPrice && order.totalPrice) : ""}</span>
                    </div>
                  </div>
                </div>

                <Typography>Order Status :</Typography>
                <div className="sectionBox">
                  <div className="orderDetailsContainerBox">
                    <div>
                      <span>Status: </span>
                      <span className={ order ? (order.orderStatus && order.orderStatus === "Delivered" ? "greenColor" : "redColor") : "redColor"}>
                        {order ? (order.orderStatus && order.orderStatus) : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="confirmCartItems">
                <Typography className="cartItemsSection">Your Cart Items:</Typography>
                <div className="confirmCartItemsContainer">
                  {order ? (order.orderItems &&
                    order.orderItems.map((item) => (
                      <div key={item.product}>
                        <img src={item.image} alt="Product" />
                        <Link to={`/product/${item._id}`}>
                          {item.name}
                        </Link>{" "}
                        <span>
                          {item.quantity} X ${item.price} ={" "}
                          <b>${item.price * item.quantity}</b>
                        </span>
                      </div>
                    ))) : ""}
                </div>
              </div>
            </div>
            <div
              style={{
                display: order ? (order.orderStatus === "Delivered" ? "none" : "block") : "none",
              }}
            >
              <form className="updateOrderForm" onSubmit={updateOrderSubmitHandler}>
                <h1>Process Order</h1>
                <div>
                  <AccountTreeIcon />
                  <select onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Choose Category</option>
                    {order ? (order.orderStatus === "Processing" && (
                      <option value="Shipped">Shipped</option>
                    )) : ""}

                    {order ? (order.orderStatus === "Shipped" && (
                      <option value="Delivered">Delivered</option>
                    )) : ""}
                  </select>
                </div>

                <Button id="createProductBtn" type="submit">
                  Process
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateOrder;