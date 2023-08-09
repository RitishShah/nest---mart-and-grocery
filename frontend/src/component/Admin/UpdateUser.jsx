import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import MetaData from "../../more/MetaData";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonIcon from "@material-ui/icons/Person";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import SideBar from "./Sidebar";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import StatusCode from "../../redux/StatusCode";
import { singleUserDetails } from "../../redux/singleUserDetailSlice";
import { updateUserRoleDetails } from "../../redux/updateUserRoleSlice";
import { getAllUsers } from "../../redux/allUsersSlice";

const UpdateUser = () => {
  const history = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const { status, error, singleUserData: user } = useSelector((state) => state.singleUserDetail);
  const { status: updateUserStatus } = useSelector((state) => state.updateUserRole);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const userId = params.id;

  useEffect(() => {
    if (!user || (user && user._id !== userId)) {
      dispatch(singleUserDetails(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
    if (error) {
      toast.error(error);
    }
  }, [dispatch, error, history, user, userId]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();
    const data = { "role": role, "email": email, "name": name, "id": userId }

    dispatch(updateUserRoleDetails(data)).then((response) => {
      const keys = Object.keys(response.payload);
      if(keys.includes("error")) {
        toast.error(response.payload.error.message);
      } else {
        toast.success("User Updated Successfully");
        dispatch(singleUserDetails(userId));
        dispatch(getAllUsers());
        history("/admin/users");
      }
    })
  };

  if(status === StatusCode.LOADING || updateUserStatus === StatusCode.LOADING) {
    return <p>Loading...</p>
  }

  if(status === StatusCode.ERROR || updateUserStatus === StatusCode.ERROR) {
    return <p>Something went wrong! try again later</p>
  }

  return (
    <Fragment>
      <MetaData title="Update User" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form className="createProductForm" onSubmit={updateUserSubmitHandler}>
            <h1>Update User</h1>

            <div>
              <PersonIcon />
              <input type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div>
              <MailOutlineIcon />
              <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>

            <div>
              <VerifiedUserIcon />
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Choose Role</option>
                <option value="admin">admin</option>
                <option value="user">user</option>
              </select>
            </div>

            <Button id="createProductBtn" type="submit">
              Update
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser;