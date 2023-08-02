import React, { useState, useEffect } from 'react'
import MetaData from '../../more/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import StatusCode from '../../redux/StatusCode';
import Carousel from 'react-material-ui-carousel';
import "./ProductDetails.css";
import { Rating } from "@material-ui/lab";
import { toast } from 'react-toastify';
import { addProductInCart } from '../../redux/addItemToCartSlice';
import { addProductInFavourite } from '../../redux/addItemToFavouriteSlice';
import ReviewCard from './ReviewCard';
import { createReviewDetails } from '../../redux/createReviewSlice';
import BottomTab from '../../more/BottomTab';
import { clearSingleProductDetailError, getSingleProductDetails, resetSingleProductDetails } from '../../redux/singleProductDetailSlice';
import { allReviewsProductDetails } from '../../redux/allReviewsProductSlice';
import { getAllProducts } from '../../redux/allProductsSlice';

const ProductDetails = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

    
    const { data: product, status, error, isProductFetched, currProductId } = useSelector(state => state.singleProductDetail);
    console.log("Product detail Check", product);
    const { isAuthenticated } = useSelector((state) => state.login);
    const params = useParams();

    // Increase quantity
    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => {
        if (product.stock <= quantity) return toast.error("Product stock limited");
        const qty = quantity + 1;
        setQuantity(qty);
    };
    
    const decreaseQuantity = () => {
        if (1 >= quantity) return;
        const qty = quantity - 1;
        setQuantity(qty);
    };

    const reviewSubmitHandler = (e) => {
      e.preventDefault();
  
      // const myForm = new FormData();
      // myForm.set("rating", rating);
      // myForm.set("comment", comment);
      // myForm.set("productId", match.params.id);

      if(isAuthenticated) {
        if(comment.length === 0) {
          toast.error("Please fill the comment box");
        } else {
          dispatch(createReviewDetails({ "rating": rating, "comment": comment, "productId": params.id })).then((response) => {
            const keys = Object.keys(response.payload);
            if(keys.includes("error")) {
              toast.error(response.payload.error.message);
            } else {
              toast.success("Review Created Successfully. Please Reload.");
              dispatch(allReviewsProductDetails(params.id));
              dispatch(getAllProducts());
              dispatch(resetSingleProductDetails());
              history('/products');
            }
          });
        }
      } else {
        history(`/login?redirect=/`);
      }
  
      // isAuthenticated !== true ? history(`/login?redirect=/`) : <></>;
  
      // dispatch(createReviewDetails({ "rating": rating, "comment": comment, "productId": params.id }));
  
      // comment.length === 0 ? toast.error("Please fill the comment box") : toast.success("Review done successfully reload for watch it");
      // dispatch({ type: NEW_REVIEW_RESET });
    };

    const addToCartHandler = () => {
      const items = localStorage.getItem("cartList") !== null ? JSON.parse(localStorage.getItem("cartList")) : [];
      const reqItem = items.find((item) => item._id === product._id);
      console.log("addHandler", reqItem);

      if(reqItem && (product.stock < reqItem.quantity + quantity)) {
        toast.error("Product stock limited");
        return;
      }

      if (product.stock >= quantity) {
        // console.log(product.quantity, quantity);
        // dispatch(addItemToCartDetails({"id": params.id, "quantity": quantity}));
        dispatch(addProductInCart({product, quantity}));

        // localStorage.clear();
        // Object.keys(localStorage).forEach((key) => {
        //   localStorage.removeItem(key);
        // });

        // localStorage.removeItem("cartList");

        // toast.success("Product Added to cart");
        
        toast.success("Product Added to cart");
      } else {
        // toast.error("Product stock limited");
        toast.error("Product stock limited");
      }
    };

    const addToFavouriteHandler = () => {
      dispatch(addProductInFavourite(product));
      // toast.success("Product Added to Favourites");
      toast.success("Product Added to Favourites");
    };

    useEffect(() => {
      if(error) {
        toast.error(error);
        dispatch(clearSingleProductDetailError());
        history("/products");
      }
      // dispatch an action for fetch
      if(!isProductFetched || params.id !== currProductId) {
        dispatch(getSingleProductDetails(params.id));
      }
      console.log("Product Single fetching...")
    }, [error, history, isProductFetched, dispatch, params.id, currProductId]);
    
    if(status === StatusCode.LOADING) {
      return <p>Loading...</p>
    }
  
    if(status === StatusCode.ERROR) {
      return <p>Something went wrong! try again later</p>
    }

  const options = {
    value: product && product.rating,
    readOnly: true,
    precision: 0.5
  };

    return (
        <>
        {/* {error ? ("") :
          (  */}
          <>
            <MetaData title={`${product && product.name}`} />
            <div className="ProductDetails">
            <div className="first__varse">
                <Carousel>
                  {product && product.images &&
                  product.images.map((item, i) => (
                    <img className="CarouselImage" key={i} src={item.url} alt={`${i} Slide`}/>
                  ))}
                </Carousel>
            </div>
            <div className="varse__2">
              <div className="detailsBlock-1">
                <h2>{product && product.name}</h2>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options}/>
                <span>({product && product.numOfReviews} Reviews)</span>
              </div>
              <div className="detailsBlock">
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <h1>{`$${product && product.price}`}</h1>
                  <h1 className="discountPrice">
                    {product && product.offerPrice > 0 ? `$${product && product.offerPrice}` : ""}
                  </h1>
                </div>
                <div className="detailsBlock-3-1">
                  <span className="quantity">Quantity</span>
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input type="number" readOnly value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>{" "}
                </div>
                <p className="stock__meta" style={{ paddingBottom: ".5vmax" }}>
                  <b className={product && product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product && product.stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
                <div
                  className="Description"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span>Description:</span>
                  <p>{product && product.description}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="wishlist"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      padding: "15px 5px",
                    }}
                    onClick={addToFavouriteHandler}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-heart"
                      viewBox="0 0 16 16"
                    >
                      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path>
                    </svg>
                    <span
                      className="cartBtn"
                      style={{ opacity: 0.7, padding: "0px 5px" }}
                    >
                      Add to wishlist
                    </span>
                  </div>

                  <div
                    className="pointer flex"
                    style={{
                      padding: "10px 5px",
                      alignItems: "center",
                      backgroundColor: "#E4EAEC",
                    }}
                    onClick={addToCartHandler}
                  >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-bag"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                  </svg>
                    <button
                      className="cartBtn"
                      style={{
                        opacity: 0.7,
                        padding: "0px 5px",
                        border: "none",
                        cursor: "pointer",
                        background: "none",
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Reviews */}
          <div className="reviews__heading">
            <h1
              style={{
                padding: "5px 30px",
                opacity: 1,
                borderBottom: "1px solid #999",
                fontFamily: "Poppins,sans-serif",
              }}
            >
              Reviews
            </h1>
          </div>
          <div>
            {/* Reviews */}
            <div
              style={{
                padding: "1vmax",
              }}
            >
              {product && product.reviews && product.reviews[0] ? (
                <div className="review__option">
                  {product && product.reviews &&
                    product.reviews.map((review) => (
                      <ReviewCard review={review} />
                    ))}
                </div>
              ) : (
                <p
                  className="noReviews"
                  style={{
                    fontFamily: "Poppins,sans-serif",
                  }}
                >
                  No Reviews Yet *
                </p>
              )}
              <div
                style={{
                  padding: "0px 2vmax",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontSize: "1.8vmax",
                    fontWeight: "700",
                    lineHeight: 1,
                    letterSpacing: "-.0125em",
                    color: "#222",
                    fontFamily: "Poppins,sans-serif",
                  }}
                >
                  Add a Review
                </span>
                <div
                  style={{
                    margin: "1vmax 0",
                    flexDirection: "column",
                    display: "flex",
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: "#222",
                        fontFamily: "Poppins,sans-serif",
                        padding: "1vmax 0",
                      }}
                    >
                      Your Rating*
                    </span>
                    <Rating
                      onChange={(e) => setRating(e.target.value)}
                      value={rating}
                      size="large"
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    ></div>
                  </div>
                </div>
                <textarea
                  cols="30"
                  rows="6"
                  placeholder="Comment *"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{
                    maxWidth: "100%",
                    color: "#111",
                    borderColor: "#e1e1e1",
                    background: "#fff",
                    borderRadius: "0.3rem",
                    outline: "none",
                    padding: "5px",
                    fontSize: "1.2vmax",
                    lineHeight: "1.5",
                    resize: "none",
                    display: "block",
                  }}
                ></textarea>
                <button
                  type="submit"
                  style={{
                    width: "12vmax",
                    margin: "1vmax 0px",
                    fontFamily: "sans-serif",
                    padding: "10px 15px",
                    background: "#3BB77E",
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                  }}
                  onClick={reviewSubmitHandler}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
          <BottomTab/> 
        </>
        {/* )} */}
        </>
    )
}

export default ProductDetails;