import React, { Fragment } from "react";
// import { DataGrid } from "@mui/x-data-grid";
import "./AllReviews.css";
import { useSelector } from "react-redux";
// import { clearErrors, getAllReviews, deleteReviews } from "../../actions/ProductActions";
// import { Button } from "@material-ui/core";
import MetaData from "../../more/MetaData";
// import DeleteIcon from "@material-ui/icons/Delete";
// import Star from "@material-ui/icons/Star";
import SideBar from "./Sidebar";
// import { DELETE_REVIEW_RESET } from "../../constans/ProductConstans";
// import { toast } from 'react-toastify';
// import { useNavigate } from "react-router-dom";
// import { allReviewsProductDetails } from "../../redux/allReviewsProductSlice";
// import { deleteProductReviewDetails } from "../../redux/deleteProductReviewSlice";
import AdminProductCard from "./AdminProductCard";
import StatusCode from "../../redux/StatusCode";

const AllReviews = () => {
  // const dispatch = useDispatch();
  // const history = useNavigate();

//   const { error: deleteError, isProductReviewDeleted } = useSelector((state) => state.deleteProductReview);
  // const { productRevie6wsData: reviews } = useSelector((state) => state.allReviewsProduct);
  const { data: products, status } = useSelector(state => state.allProducts);

    // const deleteReviewHandler = (reviewId) => {
    //     const data = { "reviewId": reviewId, "productId": productId };
    //     dispatch(deleteProductReviewDetails(data)).then((response) => {
    //         console.log(response.payload);
    //         const keys = Object.keys(response.payload);
    //         if(keys.includes("error")) {
    //             console.log("payload", response.payload);
    //             toast.error(response.payload.error.message);
    //         }
    //         else {
    //             console.log("Get deleted Reviews of a  Product in redux success", response);
    //             toast.success("Review Deleted Successfully.");
    //             dispatch(allReviewsProductDetails(productId));
    //             history('/admin/reviews');
    //         }
    //     }).catch((error) => {
    //         console.log(error);
    //         return;
    //     });
    // };

  // const productReviewsSubmitHandler = (e) => {
  //   e.preventDefault();
  //   dispatch(allReviewsProductDetails(productId)).then((response) => {
  //       console.log(response.payload);
  //       const keys = Object.keys(response.payload);
  //       if(keys.includes("error")) {
  //           console.log("payload", response.payload);
  //           toast.error(response.payload.error.message);
  //       }
  //       else {
  //           console.log("Get Reviews of a  Product in redux success", response);
  //       }
  //   }).catch((error) => {
  //       console.log(error);
  //       return;
  //   });
  // };

//   useEffect(() => {
//     // if (productId.length === 24) {
//     //     console.log("skdsfjdlsnfdslnfdsjlndsjgdssdd");
//     //   dispatch(allReviewsProductDetails(productId));
//     // }
//     // if (error) {
//     //   toast.error(error);
//     // //   dispatch(clearErrors());
//     // }

//     if (deleteError) {
//       toast.error(deleteError);
//     //   dispatch(clearErrors());
//     }

//     if (isProductReviewDeleted) {
//       toast.success("Review Deleted Successfully");
//       dispatch(resetDeleteProductReview());
//       dispatch(allReviewsProductDetails(productId));
//       history("/admin/reviews");
//     //   dispatch({ type: DELETE_REVIEW_RESET });
//     }
//   }, [dispatch, error, deleteError, history, isProductReviewDeleted, productId]);

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
          {/* <form
            className="productReviewsForm"
            // onSubmit={productReviewsSubmitHandler}
          >
            <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

            <div>
              <Star/>
              <input
                type="text"
                placeholder="Product Id"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>
          </form>
            <Button
              id="createProductBtn"
              type="submit"
              onClick={productReviewsSubmitHandler}
            //   disabled={ loading ? true : false || productId === "" ? true : false }
            >
              Search
            </Button> */}

          {/* {reviews && reviews.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
            //   pageSize={10}
            //   disableSelectionOnClick
              className="productListTable"
            //   autoHeight
            />
          ) : (
            <h1 className="productReviewsFormHeading">No Reviews Found</h1>
          )} */}

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