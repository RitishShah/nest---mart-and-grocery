import React, {useState } from "react";
import "./EditProfile.css";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../../more/MetaData";
import { toast } from 'react-toastify';
import { updateProfileDetails } from "../../redux/updateProfileSlice";
import StatusCode from "../../redux/StatusCode";
import { useNavigate } from "react-router-dom";
import { updateData } from "../../redux/loginSlice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const history = useNavigate();

  const { status } = useSelector((state) => state.updateProfile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState("/profile.png");


  const updateProfileSubmit = (e) => {
    e.preventDefault();

    dispatch(updateProfileDetails({ name: name, email: email, avatar: avatar })).then((response) => {
        // Redirect to home page on successful login
        console.log(response.payload);
        const keys = Object.keys(response.payload);
        if(keys.includes("error")) {
            console.log("payload", response.payload);
            toast.error(response.payload.error.message);
        }
        else {
            console.log("Updated Data in redux", response);
            dispatch(updateData(response.payload.data));
            // toast.success("Profile Updated Successfully");
            toast.success("Profile Updated Successfully");
            history('/me');
        }
      })
      .catch((error) => {
        // Handle login error
        console.log('Login error:', error);
        return;
      });
  };

  console.log(avatar);

  const updateProfileDataChange = (e) => {
    const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
    }
    reader.readAsDataURL(e.target.files[0]);
  };

  if(status === StatusCode.LOADING) {
    return <p>Loading...</p>
  }

  if(status === StatusCode.ERROR) {
      return <p>Something went wrong! try again later</p>
  }


  return (
    <>
      <MetaData title="Update Profile" />
      <div className="updateProfileContainer">
        <div className="updateProfileBox">
          <h2 className="updateProfileHeading">Update Profile</h2>

          <form className="updateProfileForm" encType="multipart/form-data" onSubmit={updateProfileSubmit}>
              <div className="updateProfileName">
                <FaceIcon />
                <input type="text" placeholder="Name" required name="name" value={name} onChange={(e) => setName(e.target.value)}/>
              </div>
              <div className="updateProfileEmail">
                <MailOutlineIcon />
                <input type="email" placeholder="Email" required name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </div>

              <div id="updateProfileImage">
                <img src={avatarPreview} alt="Avatar Preview" />
                <input type="file" name="avatar" accept="image/*" onChange={updateProfileDataChange}/>
              </div>
              <input type="submit" value="Update" className="updateProfileBtn"/>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditProfile