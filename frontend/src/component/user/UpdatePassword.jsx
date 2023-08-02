import React, { useState } from "react";
import "./UpdatePassword.css";
// import Loading from "../../more/Loader";
import { useDispatch, useSelector } from "react-redux";
// import { useAlert } from "react-alert";
import MetaData from "../../more/MetaData";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { useNavigate } from "react-router-dom";
import StatusCode from "../../redux/StatusCode";
import { updatePasswordDetails } from "../../redux/updatePasswordSlice";
import { toast } from "react-toastify";

const UpdatePassword = () => {

const dispatch = useDispatch();
const history = useNavigate();
  // const alert = useAlert();

  const { status } = useSelector((state) => state.updatePassword);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    // const myForm = new FormData();

    // myForm.set("oldPassword", oldPassword);
    // myForm.set("newPassword", newPassword);
    // myForm.set("confirmPassword", confirmPassword);

    dispatch(updatePasswordDetails({ oldPassword: oldPassword, newPassword: newPassword, confirmPassword: confirmPassword })).then((response) => {
      // Redirect to home page on successful login
      console.log(response.payload);
      const keys = Object.keys(response.payload);
      if(keys.includes("error")) {
          console.log("payload", response);
          toast.error(response.payload.error, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 5000,
          });
      }
      else {
        toast.success("Password Updated Successfully");
        history('/me');
      }
    })
    .catch((error) => {
      // Handle login error
      console.log('Login error:', error);
      return;
    });
  };

  // useEffect(() => {
  //   if (error) {
  //     toast(error);
  //   }

  //   if (update) {
  //     toast.success("Profile Updated Successfully");
  //     history("/me");
  //   }
  // }, [dispatch, error, toast, history, update]);

  if(status === StatusCode.LOADING) {
    return <p>Loading...</p>
  }

  if(status === StatusCode.ERROR) {
      return <p>Something went wrong! try again later</p>
  }

  return (
    <>
        <>
          <MetaData title="Change Password" />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Update Profile</h2>

              <form
                className="updatePasswordForm"
                onSubmit={updatePasswordSubmit}
              >
                <div className="loginPassword">
                  <VpnKeyIcon />
                  <input
                    type="password"
                    placeholder="Old Password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockIcon />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  value="Change"
                  className="updatePasswordBtn"
                />
              </form>
            </div>
          </div>
        </>
      {/* <BottomTab /> */}
    </>
  );
};

export default UpdatePassword