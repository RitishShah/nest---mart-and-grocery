import { React, useRef, useState } from 'react';
import MetaData from '../../more/MetaData';
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import "./LoginSignup.css";
import { useDispatch } from 'react-redux';
import { getLoginDetails } from '../../redux/loginSlice';
import { registerDetails } from '../../redux/registerSlice';
import { useNavigate } from 'react-router-dom';
import { addCartProductsToLocalStorage, cartDatabaseToLocalStorageDetails } from '../../redux/addItemToCartSlice';
import { addFavouriteProductsToLocalStorage, favouriteDatabaseToLocalStorageDetails } from '../../redux/addItemToFavouriteSlice';

const LoginSignup = () => {
    const history = useNavigate();
    const dispatch = useDispatch();
  
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
  
    const [user, setUser] = useState({
      name: "",
      email: "",
      password: "",
    });
  
    const { name, email, password } = user;
    
    const loginTab = useRef(null);
    const registerTab = useRef(null);
    const switcherTab = useRef(null);
    
    const [avatar, setAvatar] = useState("/profile.png");
    const [avatarPreview, setAvatarPreview] = useState("/profile.png");

    const [loginButtonPressed, setLoginButtonPressed] = useState(false);

    const loginSubmit = (e) => {
        e.preventDefault();
        setLoginButtonPressed(true);
        console.log(loginEmail, loginPassword);
        dispatch(getLoginDetails({ email: loginEmail, password: loginPassword })).then((response) => {
            // Redirect to home page on successful login
            console.log(response.payload);
            const keys = Object.keys(response.payload);
            if(keys.includes("error")) {
                console.log("payload", response);
                toast.error(response.payload.error);
            } else {
                console.log("reached Here ");
                dispatch(cartDatabaseToLocalStorageDetails()).then((response) => {
                    const keys = Object.keys(response.payload);
                    if(keys.includes("error")) {
                        toast.error("Some Problem during fetching cart");
                    } else {
                        dispatch(addCartProductsToLocalStorage());
                        dispatch(favouriteDatabaseToLocalStorageDetails()).then((response) => {
                            const keys = Object.keys(response.payload);
                            if(keys.includes("error")) {
                                toast.error("Some Problem during fetching favourite");
                            } else {
                                dispatch(addFavouriteProductsToLocalStorage());
                                toast.success("Login Successful");
                                history('/');
                            }
                        })
                    }
                })
            }
          })
          .catch((error) => {
            // Handle login error
            console.log('Login error:', error);
            return;
          });
    };
    
    const registerSubmit = (e) => {
        e.preventDefault();

        const userData = { "name": name, "email": email, "password": password, "avatar": avatar };
        dispatch(registerDetails(userData)).then((response) => {
            // Redirect to home page on successful login
            console.log("Dom", response.payload);
            const keys = Object.keys(response.payload);
            if(keys.includes("error")) {
                console.log("payload", response);
                toast.error(response.payload.error.message[0]);
                console.log("Toastend");
            }
            else {
                toast.success("Registration Successful. Please Login Now!");
                history('/');
            }
          })
          .catch((error) => {
            // Handle login error
            console.log('Login error:', error);
            return;
          });
    };
    
    const registerDataChange = (e) => {
        console.log(e.target.name);

        if (e.target.name === "avatar") {
            console.log("Inside avatar");
          const reader = new FileReader();
    
          reader.onload = () => {
            if (reader.readyState === 2) {
              setAvatarPreview(reader.result);
              setAvatar(reader.result);
            }
          };
    
          reader.readAsDataURL(e.target.files[0]);
        } else {
            console.log(user);
          setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const switchTabs = (e, tab) => {
        if (tab === "login") {
            switcherTab.current?.classList.add("shiftToNeutralForm");
            switcherTab.current?.classList.remove("shiftToRight");
    
            registerTab.current?.classList.remove("shiftToNeutralForm");
            loginTab.current?.classList.remove("shiftToLeft");
        }
        if (tab === "register") {
            switcherTab.current?.classList.remove("shiftToNeutralForm");
            switcherTab.current?.classList.add("shiftToRight");
    
            registerTab.current?.classList.add("shiftToNeutralForm");
            loginTab.current?.classList.add("shiftToLeft");
        }
    };
 
    return (
        <>
            <MetaData title="Login or Signup" />
            <div className="LoginSignUpContainer">
                <div className="LoginSignUpBox">
                    <div>
                        <div className="login_signUp_toggle">
                            <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                            <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                        </div>
                        <button ref={switcherTab}></button>
                    </div>
                    <form className="loginForm" ref={loginTab}  onSubmit={loginSubmit}>
                        <div className="loginEmail">
                            <MailOutlineIcon />
                            <input type="email" placeholder="Email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}/>
                        </div>
                        <div className="loginPassword">
                            <LockOpenIcon />
                            <input type="password" placeholder="Password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                        </div>
                        <Link to="/password/forgot">Forgot Password ?</Link>
                        <input type="submit" value="Login" className="loginBtn" disabled={loginButtonPressed}/>
                        <Link to="/">
                            <span>Login as a guest ?</span>
                        </Link>
                    </form>

                    <form className="signUpForm" ref={registerTab} encType="multipart/form-data"  onSubmit={registerSubmit}>
                    <div className="signUpName">
                        <FaceIcon />
                        <input type="text" placeholder="Name" required name="name" value={name} onChange={registerDataChange}/>
                    </div>
                    <div className="signUpEmail">
                        <MailOutlineIcon />
                        <input type="email" placeholder="Email" required name="email" value={email} onChange={registerDataChange}/>
                    </div>
                    <div className="signUpPassword">
                        <LockOpenIcon />
                        <input type="password" placeholder="Password" required name="password" value={password} onChange={registerDataChange}/>
                    </div>

                    <div id="registerImage">
                        <img src={avatarPreview} alt="Avatar Preview" />
                        <input type="file" name="avatar" accept="image/*" onChange={registerDataChange} />
                    </div>
                    <input type="submit" value="Register" className="signUpBtn" />
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginSignup;