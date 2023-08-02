import React, { Fragment, useState } from "react";
import "./ForgotPassword.css";
// import Loading from "../../more/Loader";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { useDispatch, useSelector } from "react-redux";
// import { clearErrors, forgotPassword } from "../../actions/userAction";
import { toast } from 'react-toastify';
import MetaData from "../../more/MetaData";
import { forgotPasswordDetails } from "../../redux/forgotPasswordSlice";
import StatusCode from "../../redux/StatusCode";

const  ForgotPassword = () => {
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.forgotPassword);
    const [email, setEmail] = useState("");
  
    const forgotPasswordSubmit = (e) => {
      e.preventDefault();
  
      const data = {"email": email};
    //   myForm.set("email", email);
      dispatch(forgotPasswordDetails(data)).then((response) => {
        console.log("forgot PAssword Payload", response.payload);
        const keys = Object.keys(response.payload);
        if(keys.includes("error")) {
            toast.error(response.payload.error);
        } else {
            toast.success("Account Recovery Link Sent Successfully. Open E-mail");
        }
      })
    };
  
    // useEffect(() => {
    //   if (error) {
    //     toast.error(error);
    //     // dispatch(clearErrors());
    //   }
  
    //   if (message) {
    //     toast.success(message);
    //   }
    // }, [dispatch, error, message]);

    if(status === StatusCode.LOADING) {
        return <p>Loading...</p>
      }
    
      if(status === StatusCode.ERROR) {
          return <p>Something went wrong! try again later</p>
      }
  
    return (
      <Fragment>
        {/* {loading ? (
          <Loading />
        ) : ( */}
          <Fragment>
            <MetaData title="Forgot Password" />
            <div className="forgotPasswordContainer">
                <div className="forgotPasswordBox">
                    <h2 className="forgotPasswordHeading">Forgot Password</h2>
                    <form className="forgotPasswordForm" onSubmit={forgotPasswordSubmit} >
                    <div className="forgotPasswordEmail">
                        <MailOutlineIcon />
                        <input type="email" placeholder="Email" required name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <input type="submit" value="Send" className="forgotPasswordBtn" />
                    </form>
                </div>
            </div>
          </Fragment>
        {/* )} */}
      </Fragment>
    );
  };

export default ForgotPassword