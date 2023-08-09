import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "./ProductCard";
import Pagination from "react-js-pagination";
import "./Products.css";
import Typography from"@material-ui/core/Typography";
import MetaData from "../../more/MetaData";
import StatusCode from "../../redux/StatusCode";
import { useNavigate, useParams } from "react-router-dom";
import { getProducts } from "../../redux/productSlice";
import BottomTab from "../../more/BottomTab";

const categories = [ "Personal", "cloth", "Ladies Cloth", "Gift", "Food", "Electronics", "Sports", "Others" ];

const Products = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const history = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);  
  const [category,setCategory] = useState("");
  const { data: products, status, totalProducts: count, resultPerPage } = useSelector((state) => state.products);

  const myCartHandler = () => {
    history("/cart");
  }

  const myFavouriteHandler = () => {
    history("/favourites");
  }

  const keyword = params.keyword;
  console.log("Keyword", keyword);

  const setCurrentPageNo = (pageNumber) => {
    console.log("setCurrentPageNo called:", pageNumber);
    console.log("currentPage", currentPage);
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    console.log("Keyword", keyword);
    dispatch(getProducts({"keyword": keyword, "currentPage": currentPage, "category": category}));
  }, [dispatch,keyword,currentPage,category]);

  if(status === StatusCode.LOADING) {
    return <p>Loading...</p>
  }

  if(status === StatusCode.ERROR) {
    return <p>Something went wrong! try again later</p>
  } 

  return (
    <>
      <MetaData title="Products" />
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
                <li className="category-link" onClick={myCartHandler}>
                  My Carts
                </li>
                <li className="category-link" onClick={myFavouriteHandler}>
                  Favourites Items
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
        <BottomTab />
    </>
  );
};

export default Products;