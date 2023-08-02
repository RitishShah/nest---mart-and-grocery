import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./CreateProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import MetaData from "../../more/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
// import { getAllOrders, clearErrors, deleteOrder } from "../../actions/OrderAction";
// import { DELETE_ORDER_RESET } from "../../constans/OrderConstans";
import { toast } from 'react-toastify';
import { getAllOrders } from "../../redux/allOrdersSlice";
import { deleteOrderDetails, resetDeleteOrder } from "../../redux/deleteOrderSlice";
import { singleOrderDetails } from "../../redux/singleOrderDetailSlice";


const AllOrders = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

//   const { error, orders } = useSelector((state) => state.AllOrders);
  const { allOrdersData: orders, isAllOrdersReceived } = useSelector((state) => state.allOrders);
  const { isOrderDeleted } = useSelector((state) => state.deleteOrder);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrderDetails(id));
  };

  const callSingleOrderDetails = (id) => {
    dispatch(singleOrderDetails(id));
  }

  useEffect(() => {
    // if (error) {
    //   toast.error(error);
    //   dispatch(clearErrors());
    // }

    // if (deleteError) {
    //   toast.error(deleteError);
    //   dispatch(clearErrors());
    // }

    if(!isAllOrdersReceived) {
      dispatch(getAllOrders());
    }

    if (isOrderDeleted) {
      toast.success("Order Deleted Successfully");
      history("/admin/orders");
      dispatch(getAllOrders());
      dispatch(resetDeleteOrder());
    }
  }, [dispatch, history, isOrderDeleted, orders, isAllOrdersReceived]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },

    { field: "status", headerName: "Status", minWidth: 150, flex: 0.5,
      cellClassName: (params) => { console.log("Order DataGrid Column", params); return params.row.status === "Delivered" ? "greenColor" : "redColor" },
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 150, flex: 0.4, },

    { field: "amount", headerName: "Amount", type: "number", minWidth: 270, flex: 0.5, },

    { field: "actions", flex: 0.3, headerName: "Actions", minWidth: 150, type: "number", sortable: false,
      renderCell: (params) => {
        console.log("Delete Order DataGrid", params);
        return (
          <Fragment>
            <Link to={`/admin/order/${params.row.id}`} onClick={() => callSingleOrderDetails(params.row.id)}>
              <EditIcon />
            </Link>

            <Button onClick={() => deleteOrderHandler(params.row.id) }>
                <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
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
      <MetaData title={`ALL ORDERS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL ORDERS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            className="productListTable"
          />
        </div>
      </div>
    </Fragment>
  );
};

export default AllOrders;