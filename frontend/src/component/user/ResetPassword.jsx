import React, { Fragment, useState } from "react";
import "./ResetPassword.css";
// import Loading from "../../more/Loader";
import { useDispatch, useSelector } from "react-redux";
// import { clearErrors, resetPassword } from "../../actions/userAction";
import MetaData from "../../more/MetaData";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import { resetPasswordDetails } from "../../redux/resetPasswordSlice";
import StatusCode from "../../redux/StatusCode";

const ResetPassword = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const params = useParams();

    // const { isAuthenticated } = useSelector((state) => state.login);
    const { status } = useSelector((state) => state.resetPassword);
  
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  
    const resetPasswordSubmit = (e) => {
        e.preventDefault();
    //   const myForm = new FormData();
    //   myForm.set("password", password);
    //   myForm.set("confirmPassword", confirmPassword);

        const data = { "token": params.token, "password": password, "confirmPassword": confirmPassword };
        dispatch(resetPasswordDetails(data)).then((response) => {
          console.log(response.payload);
          const keys = Object.keys(response.payload);
          if(keys.includes("error")) {
            toast.error(response.payload.error);
          } else {
            toast.success("Password Reset Successfully");
            history('/login');
          }
        })
    };

    if(status === StatusCode.LOADING) {
      return <p>Loading...</p>
    }
    
    if(status === StatusCode.ERROR) {
      return <p>Something went wrong! try again later</p>
    }
  
    // useEffect(() => {
    //   if (error) {
    //     toast.error(error);
    //     dispatch(clearErrors());
    //   }
  
    //   if (success) {
    //     toast.success("Password Updated Successfully");
    //     history("/login");
    //   }
    // }, [dispatch, error, history, success]);


  
    return (
      <Fragment>
        {/* {loading ? (
          <Loading />
        ) : ( */}
          <Fragment>
            <MetaData title="Change Password" />
            <div className="resetPasswordContainer">
              <div className="resetPasswordBox">
                <h2 className="resetPasswordHeading">Update Profile</h2>
                <form className="resetPasswordForm" onSubmit={resetPasswordSubmit} >
                    <div>
                    <LockOpenIcon />
                        <input type="password" placeholder="New Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                  <div className="loginPassword">
                    <LockIcon />
                    <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                  <input
                    type="submit"
                    value="Update"
                    className="resetPasswordBtn"
                  />
                </form>
              </div>
            </div>
          </Fragment>
        {/* )} */}
      </Fragment>
    );
  };
  
  export default ResetPassword;