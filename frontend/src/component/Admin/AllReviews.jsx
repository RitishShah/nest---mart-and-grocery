import React, { Fragment } from "react";
import "./AllReviews.css";
import { useSelector } from "react-redux";
import MetaData from "../../more/MetaData";
import SideBar from "./Sidebar";
import AdminProductCard from "./AdminProductCard";
import StatusCode from "../../redux/StatusCode";

const AllReviews = () => {
  const { data: products, status } = useSelector(state => state.allProducts);

  if(status === StatusCode.LOADING) {
    return <p>Loading...</p>
  }

  if(status === StatusCode.ERROR) {
    return <p>Something went wrong! try again later</p>
  }

  return (
    <Fragment>
      <MetaData title={`ALL REVIEWS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productReviewsContainer">
          <h1 className="productReviewsFormHeading">ALL PRODUCTS - REVIEWS</h1>
          <div className="productContainer" id="container">
            {products && products.map((product) =>(<AdminProductCard key={product._id} product={product} />))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AllReviews;