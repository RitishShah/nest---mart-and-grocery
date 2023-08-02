import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./AllReviews.css";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import MetaData from "../../more/MetaData";
import DeleteIcon from "@material-ui/icons/Delete";
// import Star from "@material-ui/icons/Star";
import SideBar from "./Sidebar";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import { allReviewsProductDetails, clearErrorsAllReviewsProduct } from "../../redux/allReviewsProductSlice";
import { deleteProductReviewDetails } from "../../redux/deleteProductReviewSlice";
import StatusCode from "../../redux/StatusCode";
import { getAllProducts } from "../../redux/allProductsSlice";

const SingleProductReview = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const params = useParams();
  const productId = params.id;

//   const { error: deleteError, isProductReviewDeleted } = useSelector(sssss(state) => state.deleteProductReview);
  const { error, productReviewsData: reviews, isProductAllReviewsFetched, currProductId, status } = useSelector((state) => state.allReviewsProduct);

    const deleteReviewHandler = (reviewId) => {
        const data = { "reviewId": reviewId, "productId": productId };
        dispatch(deleteProductReviewDetails(data)).then((response) => {
            console.log(response.payload);
            const keys = Object.keys(response.payload);
            if(keys.includes("error")) {
                console.log("payload", response.payload);
                toast.error(response.payload.error.message);
            }
            else {
                console.log("Get deleted Reviews of a  Product in redux success", response);
                toast.success("Review Deleted Successfully.");
                dispatch(allReviewsProductDetails(productId));
                dispatch(getAllProducts());
                history(`/admin/product/review/${productId}`);
            }
        }).catch((error) => {
            console.log(error);
            return;
        });
    };

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

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrorsAllReviewsProduct());
    }

    if(!isProductAllReviewsFetched || currProductId !== productId) {
        dispatch(allReviewsProductDetails(productId));
    }

  }, [dispatch, error, productId, currProductId, isProductAllReviewsFetched]);

  if(status === StatusCode.LOADING) {
    return <p>Loading...</p>
  }

  if(status === StatusCode.ERROR) {
      return <p>Something went wrong! try again later</p>
  }

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },
    { field: "user", headerName: "User", minWidth: 200, flex: 0.6, },
    { field: "comment", headerName: "Comment", minWidth: 350, flex: 1, },
    { field: "rating", headerName: "Rating", type: "number", minWidth: 180, flex: 0.4,
      cellClassName: (params) => {
        return params.row.rating >= 3 ? "greenColor" : "redColor";
      },
    },
    { field: "actions", flex: 0.3, headerName: "Actions", minWidth: 150, type: "number", sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button onClick={() => deleteReviewHandler(params.row.id)}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

    reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        user: item.name,
      });
    });

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

          {reviews && reviews.length > 0 ? (
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
          )}

          {/* <h1 className="productReviewsFormHeading">ALL PRODUCTS - REVIEWS</h1>

          <div className="productContainer" id="container">
              {products && products.map((product) =>(<ProductCard key={product._id} product={product} />))}
          </div> */}

        </div>
      </div>
    </Fragment>
  );
};

export default SingleProductReview;