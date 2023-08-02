import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './component/Home/Home.jsx';
import RootLayout from './component/Layout/RootLayout';
import ProductDetails from './component/Product/ProductDetails';
import LoginLAyout from './component/Layout/LoginLAyout';
import ProtectedRoute from './protectedRoutes/ProtectedRoute';
import Profile from './component/user/Profile';
import UpdatePassword from './component/user/UpdatePassword';
import EditProfile from './component/user/EditProfile';
import About from './component/About/About';
import Products from './component/Product/Products';
import Search from "./component/Product/Search";
import Support from './more/Support';
import Cart from './component/cart/Cart';
import Favourites from './component/cart/Favourites';
import Shipping from './component/cart/Shipping';
import ConfirmOrder from './component/cart/ConfirmOrder';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Payment from './component/cart/Payment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './component/cart/OrderSuccess';
import MoreOption from './component/user/MoreOption';
import Dashboard from './component/Admin/Dashboard';
import AdminRoute from './adminRoutes/AdminRoute';
import CreateProduct from './component/Admin/CreateProduct';
import AllProducts from './component/Admin/AllProducts';
import EditProduct from './component/Admin/EditProduct';
import AllOrders from './component/Admin/AllOrders';
import UpdateOrder from './component/Admin/UpdateOrder';
import AllUsers from './component/Admin/AllUsers';
import UpdateUser from './component/Admin/UpdateUser';
import AllReviews from './component/Admin/AllReviews';
import SingleProductReview from './component/Admin/SingleProductReview';
import ForgotPassword from './component/user/ForgotPassword';
// import { useDispatch } from 'react-redux';
// import { getUserMyselfDetails } from './redux/userDetailsMyselfSlice';
// import { useSelector } from 'react-redux';
// import UserData from './more/UserData';



function App() {
  // const router = createBrowserRouter(createRoutesFromElements(
  //   <Routes>
  //     <Route path="/" element={<RootLayout/>}>
  //       <Route index element={<Home/>}/>
  //       <Route path="/product/:id" element={<ProductDetails/>} />
  //     </Route>
  //     <Route path="/login" element={<LoginSignup/>} />
  //   </Routes>
  // ))

  // const { isAuthenticated, data:user } = useSelector((state) => state.login);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getUserMyselfDetails());
  //   console.log("APP Level Reached");
  // }, [dispatch]);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v2/stripe-api-key");
    console.log("App stripe key", data);
    setStripeApiKey(data.data);
  }

  useEffect(() => {
    getStripeApiKey();
  }, []);


  return (
    // <div className="App">
    //   <RouterProvider router={router} />
    // </div>

    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:keyword" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/me" element={<ProtectedRoute />}>
              <Route index element={<Profile />} />
            </Route>
            <Route path="/support" element={<ProtectedRoute />}>
              <Route index element={<Support/>}/>
            </Route>

            {/* more option is only meant for mobile user */}
            <Route path="/more" element={<ProtectedRoute />}>
              <Route index element={<MoreOption/>}/>
            </Route>

            <Route path="/shipping" element={<ProtectedRoute />}>
            <Route index element={<Shipping />} />
            </Route>
            <Route path="/order/confirm" element={<ProtectedRoute />}>
              <Route index element={<ConfirmOrder />} />
            </Route>
            {stripeApiKey && (
            <Route path="/process/payment" element={<ProtectedRoute />}>
                <Route index element={<Elements stripe={loadStripe(stripeApiKey)}><Payment /></Elements>} />
            </Route>
            )}
            <Route path="/order/success" element={<ProtectedRoute />}>
              <Route index element={<OrderSuccess />} />
            </Route>

          </Route>

          <Route path="/me/password/update" element={<ProtectedRoute />}>
            <Route index element={<UpdatePassword />} />
          </Route>
          <Route path="/me/profile/update" element={<ProtectedRoute />}>
            <Route index element={<EditProfile />} />
          </Route>
          {/* <Route path="/shipping" element={<ProtectedRoute />}>
            <Route index element={<Shipping />} />
          </Route>
          <Route path="/order/confirm" element={<ProtectedRoute />}>
            <Route index element={<ConfirmOrder />} />
          </Route> */}
          {/* <Route path="/shipping" element={<Shipping/>}/> */}
          {/* <Route path="/order/confirm" element={<ConfirmOrder/>}/> */}

          {/* {stripeApiKey && (
            <Route path="/process/payment" element={<ProtectedRoute />}>
                <Route index element={<Elements stripe={loadStripe(stripeApiKey)}><Payment /></Elements>} />
            </Route>
          )}
          <Route path="/order/success" element={<ProtectedRoute />}>
            <Route index element={<OrderSuccess />} />
          </Route> */}

          <Route path="/login" element={<LoginLAyout/>}/>
          <Route path="/search" element={<Search/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/favourites" element={<Favourites/>}/>


          <Route path="/dashboard" element={<AdminRoute />}>
            <Route index element={<Dashboard/>}/>
          </Route>

          <Route path="/admin/create-product" element={<AdminRoute />}>
            <Route index element={<CreateProduct/>}/>
          </Route>

          <Route path="/admin/products" element={<AdminRoute />}>
            <Route index element={<AllProducts/>}/>
          </Route>

          <Route path="/admin/edit/product/:id" element={<AdminRoute />}>
            <Route index element={<EditProduct/>}/>
          </Route>

          <Route path="/admin/orders" element={<AdminRoute />}>
            <Route index element={<AllOrders/>}/>
          </Route>

          <Route path="/admin/order/:id" element={<AdminRoute />}>
            <Route index element={<UpdateOrder/>}/>
          </Route>

          <Route path="/admin/users" element={<AdminRoute />}>
            <Route index element={<AllUsers/>}/>
          </Route>

          <Route path="/admin/user/:id" element={<AdminRoute />}>
            <Route index element={<UpdateUser/>}/>
          </Route>

          <Route path="/admin/reviews" element={<AdminRoute />}>
            <Route index element={<AllReviews/>}/>
          </Route>

          <Route path="/admin/product/review/:id" element={<AdminRoute />}>
            <Route index element={<SingleProductReview/>}/>
          </Route>

          <Route path="/password/forgot" element={<ForgotPassword/>}/>
          <Route path="/password/reset/:token" element={<ForgotPassword/>}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
