import React, { useState, useEffect } from "react";
// import Footer from "../../Footer";
// import Header from "../Home/Header";
import { useSelector, useDispatch } from "react-redux";
// import Loading from "../../more/Loader";
import ProductCard from "./ProductCard";
// import { clearErrors, getProduct } from "../../actions/ProductActions";
import Pagination from "react-js-pagination";
import "./Products.css";
import Typography from"@material-ui/core/Typography";
// import { useAlert } from "react-alert";
import MetaData from "../../more/MetaData";
import StatusCode from "../../redux/StatusCode";
// import BottomTab from "../../more/BottomTab";
import { useParams } from "react-router-dom";
import { getProducts } from "../../redux/productSlice";
import BottomTab from "../../more/BottomTab";
// import { getAllProducts } from "../../redux/allProductsSlice";

const categories = [ "Personal", "cloth", "Ladies Cloth", "Gift", "Food", "Electronics", "Sports", "Others" ];

const Products = () => {
  const dispatch = useDispatch();
  const params = useParams();
  
  const [currentPage, setCurrentPage] = useState(1);
  
  const [category,setCategory] = useState("");

  // const { data: products, status, count, resultPerPage } = useSelector((state) => state.allProducts);
  const { data: products, status, totalProducts: count, resultPerPage } = useSelector((state) => state.products);

  const keyword = params.keyword;
  console.log("Keyword", keyword);

  const setCurrentPageNo = (pageNumber) => {
    console.log("setCurrentPageNo called:", pageNumber);
    console.log("currentPage", currentPage);
    // dispatch(getProducts({"keyword": keyword, "currentPage": pageNumber, "category": category}));
    setCurrentPage(pageNumber);
    // console.log("currentPage updated:", currentPage);
  };


  // useEffect(() => {
  //     // if(error){
  //     //     alert.error(error);
  //     //     dispatch(clearErrors())
  //     // }
  //     console.log("UI", keyword, currentPage, category);
  //   dispatch(getProducts({"keyword": keyword, "currentPage": currentPage, "category": category}));

  // }, [dispatch,keyword,currentPage,category]); 

  useEffect(() => {
      // if(error){
      //     alert.error(error);
      //     dispatch(clearErrors())
      // }
      // console.log("UI", keyword, currentPage, category);
    // dispatch(getAllProducts());
    console.log("Keyword", keyword);
    dispatch(getProducts({"keyword": keyword, "currentPage": currentPage, "category": category}));
  }, [dispatch,keyword,currentPage,category]);

  if(status === StatusCode.LOADING) {
    return <p>Loading...</p>
  }

  if(status === StatusCode.ERROR) {
    return <p>Something went wrong! try again later</p>
  } 

//   const filteredProducts = useCallback(()=>{
// return products.filter((el)=>{
//   return el.hidden == true
// })
//   },[products])

  return (
    <>
      {/* {loading ? (
        <Loading />
      ) : ( */}
        <>
        <MetaData title="Products" />
          {/* <Header /> */}
          <div>
           {products.length === 0 ? 
            ""
            :
            <h2
            style={{
              textAlign: "center",
              borderBottom: "1px solid rgba(21,21,21,0.5)",
              width: "20vmax",
              fontSize: "1.4vmax",
              fontFamily: "Poppins,sans-serif",
              margin: "3vmax auto",
              color: "rgb(0, 0, 0, 0.7)",
            }}>
            Featured Products
            </h2>
           }
            <div className="sidebar__product" style={{
                display:"flex",
                flex:1,
            }}>
                <div className="sidebar__products" style={{border: "1px solid #999", margin:"1vmax", flex:".177" }}>
                  <Typography style={{fontSize:"1.2vmax",padding:"5px"}}>CHOOSE CATEGORIES</Typography>
                  <ul className="categoryBox">
                      {categories.map((category) =>(
                          <li
                          className="category-link"
                          key={category}
                          onClick={() =>setCategory(category)}
                          type="checkbox">
                          {category}
                          </li> 
                      ))}
                  </ul>
                  <Typography style={{fontSize:"1.2vmax",padding:"5px"}}>QUICK LINKS</Typography>
                  <li className="category-link">
                    My Carts
                  </li>
                  <li className="category-link">
                    Favourites Items
                  </li>
                  <li className="category-link">
                    Go to Checkout
                  </li>
              </div>

             {products.length === 0 ?
             <span style={{
               display:"block",
               padding:"30px 0",
               fontSize:"1.5rem",
               flex:".9",
               textAlign:"center"
             }}>No Product Found ....</span>
             : 
             <div
             className="products"
             style={{
               display: "flex",
               flexWrap: "wrap",
               justifyContent: "center",
               flex:".9"
             }}
           >
             {products &&
               products.map((product) => (
    
                 <ProductCard key={product.id} product={product} />
             
               ))}
           </div>
              }
             
             </div>
            
              <div
                className="pagination__box"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "6vmax",
                }}
              >
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={count}
                  onChange={setCurrentPageNo}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="First"
                  lastPageText="Last"
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                />
              </div>
          </div>
          {/* <Footer /> */}
          <BottomTab />
        </>
      {/* )} */}
    </>
  );
};

export default Products;