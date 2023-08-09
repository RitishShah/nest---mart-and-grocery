import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./UserOrders.css";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../../more/MetaData";
import { toast } from 'react-toastify';
import StatusCode from "../../redux/StatusCode";
import { clearErrorsUserOrders, userOrdersDetails } from "../../redux/userOrdersSlice";

const UserOrders = () => {
  const dispatch = useDispatch();

  const { data: user } = useSelector((state) => state.login);
  const { error, userOrdersData: orders, status, isUserOrdersFetched } = useSelector((state) => state.userOrders);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrorsUserOrders());
    }

    if(!isUserOrdersFetched) {
      dispatch(userOrdersDetails());
    }

  }, [dispatch, error, isUserOrdersFetched]);

  if(status === StatusCode.LOADING) {
    return <p>Loading...</p>
  }

  if(status === StatusCode.ERROR) {
      return <p>Something went wrong! try again later</p>
  }

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },
    { field: "status", headerName: "Status", minWidth: 150, flex: 0.5,
      cellClassName: (params) => { console.log("Order DataGrid Column", params); return params.row.status === "Delivered" ? "greenColor" : "redColor" },
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 150, flex: 0.4, },
    { field: "amount", headerName: "Amount", type: "number", minWidth: 270, flex: 0.5, },
  ];

  const rows = [];

  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <Fragment>
      <MetaData title={`${user.data.name}'s Orders`} />
        <div className="headingClass">
            <h1>User's Orders</h1>
        </div>
        <div className="productReviewsContainer">
            {orders && orders.length > 0 ? (
            <DataGrid
                rows={rows}
                columns={columns}
                className="productListTable"
            />
            ) : (
            <h1 className="productReviewsFormHeading">No Orders Found</h1>
            )}
        </div>
    </Fragment>
  );
};

export default UserOrders;