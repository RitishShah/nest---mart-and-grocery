import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import MetaData from "../../more/MetaData";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonIcon from "@material-ui/icons/Person";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import SideBar from "./Sidebar";
// import { UPDATE_USER_RESET } from "../../constans/userContans";
// import { getUserDetails, updateUser, clearErrors } from "../../actions/userAction";
// import Loading from "../../more/Loader";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import StatusCode from "../../redux/StatusCode";
import { singleUserDetails } from "../../redux/singleUserDetailSlice";
import { resetUpdatedRole, updateUserRoleDetails } from "../../redux/updateUserRoleSlice";

const UpdateUser = () => {
  const history = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const { status, error, singleUserData: user } = useSelector((state) => state.singleUserDetail);
  const { error: updateError, isRoleUpdated } = useSelector((state) => state.updateUserRole);

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
    //   dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
    //   dispatch(clearErrors());
    }

    if (isRoleUpdated) {
      toast.success("User Updated Successfully");
      history("/admin/users");
      dispatch(resetUpdatedRole());
    }
  }, [dispatch, error, history, isRoleUpdated, updateError, user, userId]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    // const myForm = new FormData();

    // myForm.set("name", name);
    // myForm.set("email", email);
    // myForm.set("role", role);

    const data = { "role": role, "email": email, "name": name, "id": userId }

    dispatch(updateUserRoleDetails(data));
  };

  if(status === StatusCode.LOADING) {
    return <p>Loading...</p>
  }

  if(status === StatusCode.ERROR) {
      return <p>Something went wrong! try again later</p>
  }

  return (
    <Fragment>
      <MetaData title="Update User" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {/* {loading ? (
            <Loading />
          ) : ( */}
            <form
              className="createProductForm"
              onSubmit={updateUserSubmitHandler}
            >
              <h1>Update User</h1>

              <div>
                <PersonIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <VerifiedUserIcon />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                </select>
              </div>

              <Button
                id="createProductBtn"
                type="submit"
                // disabled={
                //   updateLoading ? true : false || role === "" ? true : false
                // }
              >
                Update
              </Button>
            </form>
          {/* )} */}
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser;