import React from "react";
import "./Home.css";
import Carousel from "react-material-ui-carousel";
import bg from "../../assets/background.jpg";
import bg2 from "../../assets/background2.jpg";
import { useDispatch, useSelector} from "react-redux";
import ProductCard from "../Product/ProductCard";
// import { getProducts } from "../../redux/productSlice";
import { useEffect } from "react";
import StatusCode from "../../redux/StatusCode";
import MetaData from "../../more/MetaData";
import { getAllProducts } from "../../redux/allProductsSlice";
import BottomTab from "../../more/BottomTab";

const Home = () => {
    const dispatch = useDispatch();
    const { data: products, status, isAllProductsFetched } = useSelector(state => state.allProducts);
    console.log("Products :",products);
    useEffect(() => {
      // dispatch an action for fetch
      if(!isAllProductsFetched) {
        dispatch(getAllProducts());
      }
    }, [dispatch, isAllProductsFetched]);

    if(status === StatusCode.LOADING) {
      return <p>Loading...</p>
    }

    if(status === StatusCode.ERROR) {
        return <p>Something went wrong! try again later</p>
    }

  return (
    <>
      <MetaData title="Home"/>
      <div className="banner">
          <Carousel>
            <img src={bg} className="bgImg" alt=""/>
            <img src={bg2} className="bgImg" alt=""/>
          </Carousel>
          <div className="home__content">
            <div style={{
              display:"flex",
              alignItems:"center",
            }}>
            <h2 style={{
              fontFamily: "Segoe Script",
              fontSize: "3em",
              fontWeight:"500"
            }}>Buy 2 Get</h2>
            <span style={{
              padding:"10px",
              backgroundColor:"#fff",
              margin:"0px 10px",
              textAlign:"center",
              width:"150px",
              height:"40px",
              color: "#26c",
              fontFamily: "Segoe Script",
              fontSize: "2.4em",
              display:"flex",
              justifyContent:"center",
              lineHeight:".7",
              alignItems:"center"
            }}>1 Free</span>
            </div>
            <div>
              <h2 style={{
                fontSize:"4.5em",
                fontFamily:"Poppins,sans-serif",
                color:"#fff",
              }}>Fashionable</h2>
            </div>
            <div>
              <h2 style={{
                fontSize:"4.5em",
                fontWeight:"400",
                fontFamily:"Poppins,sans-serif",
                color:"#fff",
                lineHeight:".7"
              }}>Collection</h2>
            </div>
            <div>
              <h2
              style={{
                fontWeight:"400",
                fontFamily:"Poppins,sans-serif",
                color:"#fff",
                fontSize:"1em",
                paddingTop:"10px"
              }}
              >
              Get Free Shipping on all orders over $99.00
              </h2>
            </div>
            <div>
              <a href="#container">
              <button type="submit" style={{
            //    width:"135px",
                height:"50px",
                border:"none",
                background:"#3BB77E",
                margin:"10px 0",
                fontSize:"1.2vmax",
                color:"#fff",
                cursor:"pointer"
              }}
              className="Home__button"
              >SHOP NOW</button>
              </a>
            </div>
          </div>
        </div>
      <h2 className="homeHeading">Featured Products</h2>
      <div className="container" id="container">
        {products && products.map((product) =>(<ProductCard key={product._id} product={product} />))}
      </div>
      <BottomTab/>
    </>    
  );
}

export default Home