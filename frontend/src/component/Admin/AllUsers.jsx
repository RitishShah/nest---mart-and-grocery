import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./AllProducts.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import MetaData from "../../more/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
// import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
// import { DELETE_USER_RESET } from "../../constans/userContans";
import { toast } from 'react-toastify';
import { getAllUsers } from "../../redux/allUsersSlice";
import { deleteUserDetails, resetDeletedUser } from "../../redux/deleteUserSlice";

const AllUsers = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const { error, allUsersData: users, isAllUsersReceived } = useSelector((state) => state.allUsers);
  const { error: deleteError, isUserDeleted } = useSelector((state) => state.deleteUser);

  const deleteUserHandler = (id) => {
    dispatch(deleteUserDetails(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    //   dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
    //   dispatch(clearErrors());
    }

    if (isUserDeleted) {
      toast.success("User Deleted Successfully");
      dispatch(resetDeletedUser());
      history("/admin/users");
    //   dispatch({ type: DELETE_USER_RESET });
    }

    if(isAllUsersReceived) {
        dispatch(getAllUsers());
    }

  }, [dispatch, error, deleteError, history, isUserDeleted, isAllUsersReceived]);

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 180, flex: 0.8 },

    { field: "email", headerName: "Email", minWidth: 200, flex: 1 },

    { field: "name", headerName: "Name", minWidth: 150, flex: 0.5 },

    { field: "role", headerName: "Role", type: "number", minWidth: 150, flex: 0.3,
      cellClassName: (params) => {
        return params.row.role === "admin" ? "greenColor" : "redColor";
      },
    },

    { field: "actions", flex: 0.3, headerName: "Actions", minWidth: 150, type: "number", sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/user/${params.row.id}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteUserHandler(params.row.id)
              }
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL USERS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL USERS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            // pageSize={10}
            // disableSelectionOnClick
            className="productListTable"
            // autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
};

export default AllUsers;