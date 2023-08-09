import React, { Fragment, useState } from "react";
import "./CreateProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import MetaData from "../../more/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import DiscountIcon from "@material-ui/icons/LocalOffer";
import SideBar from "./Sidebar";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { createProductDetails } from "../../redux/createProductSlice";
import StatusCode from "../../redux/StatusCode";

const CreateProduct = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const { status } = useSelector((state) => state.createProduct);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [offerPrice, setOfferPrice] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Personal",
    "cloth",
    "Ladies Cloth",
    "Gift",
    "Food",
    "Electronics",
    "Sports",
    "Others"
  ];

  const createProductSubmitHandler = (e) => {
    e.preventDefault();
    console.log("INside creaete");

    const data = {
        "name": name,
        "price": price,
        "offerPrice": offerPrice,
        "description": description,
        "category": category,
        "stock": stock,
        "images": images
    }

    console.log("Product data", data);
    dispatch(createProductDetails(data)).then((response) => {
      // Redirect to home page on successful login
      console.log(response.payload);
      const keys = Object.keys(response.payload);
      if(keys.includes("error")) {
        console.log("payload", response);
        toast.error(response.payload.error.message[0]);
      }
      else {
        toast.success("Product Created Successfully.");
        history('/dashboard');
      }
    })
    .catch((error) => {
      // Handle login error
      console.log('Login error:', error);
      return;
    });
  };

  const createProductImagesChange = (e) => {
    console.log("csr images", e.target.files);
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  if(status === StatusCode.LOADING) {
    return <p>Loading...</p>
  }

  if(status === StatusCode.ERROR) {
      return <p>Something went wrong! try again later</p>
  }

  return (
    <Fragment>
      <MetaData title="Create Product" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form className="createProductForm" encType="multipart/form-data" onSubmit={createProductSubmitHandler}>
            <h1>Create Product</h1>
            <div>
              <SpellcheckIcon />
              <input type="text" placeholder="Product Name" required value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            
            <div>
              <DiscountIcon />
              <input type="String" placeholder="Discount Percent (optional)" onChange={(e) => setOfferPrice(e.target.value)}/>
            </div>

            <div>
              <AttachMoneyIcon />
              <input type="number" placeholder="Product Price" required onChange={(e) => setPrice(e.target.value)}/>
            </div>

            <div>
              <DescriptionIcon />
              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="1"
              ></textarea>
            </div>

            <div>
              <AccountTreeIcon />
              <select onChange={(e) => setCategory(e.target.value)}>
                <option value="">Choose Category</option>
                {categories.map((cate) => (<option key={cate} value={cate}>{cate}</option>))}
              </select>
            </div>

            <div>
              <StorageIcon />
              <input type="number" placeholder="Stock" required onChange={(e) => setStock(e.target.value)} />
            </div>

            <div id="createProductFormFile">
              <input type="file" name="avatar" accept="image/*" onChange={createProductImagesChange} multiple/>
            </div>

            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>

            <Button id="createProductBtn" type="submit">
              Create
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateProduct;