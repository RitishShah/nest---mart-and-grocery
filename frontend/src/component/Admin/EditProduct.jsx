import React, { Fragment, useEffect, useState } from "react";
import "./CreateProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import MetaData from "../../more/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
    // eslint-disable-next-line
import DiscountIcon from "@material-ui/icons/LocalOffer";
import SideBar from "./Sidebar";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import { clearSingleProductDetailError, getSingleProductDetails } from "../../redux/singleProductDetailSlice";
import { updateProductDetails } from "../../redux/updateProductSlice";
import { getAllProducts } from "../../redux/allProductsSlice";

const UpdateProduct = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const { data: product, error } = useSelector(state => state.singleProductDetail);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  // eslint-disable-next-line
  const [offerPrice, setOfferPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = ["Personal", "cloth", "Ladies Cloth", "Shoes", "Food", "Electronics", "Sports", "Others"];

  const params = useParams();
  const productId = params.id;

  useEffect(() => {
    if (!product || (product && product._id !== productId)) {
      console.log("UseEffect called", product);
      dispatch(getSingleProductDetails(productId));
    } else {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setStock(product.stock);
      setOldImages(product.images);
    }
    if (error) {
      toast.error(error);
      dispatch(clearSingleProductDetailError());
    }

  }, [dispatch, history, productId, product, error ]);
  // Product dependancy is triggering the useEffect

  const updateProductSubmitHandler  = (e) => {
    e.preventDefault();

    const data = { "name": name, "price": price, "offerPrice": offerPrice, "description": description, "category": category, "stock": stock, "images": images };

    dispatch(updateProductDetails({ id: productId, data: data })).then((response) => {
      console.log("UPdate product response payload", response);

      const keys = Object.keys(response.payload);
      if(keys.includes("error")) {
        toast.error(response.payload.error.message[0]);
      } else {
        toast.success("Product Updated Successfully");
        history("/admin/products");
        // Inorder to reflect changes to Single Order. So that next time when user click Edit product then updated info will shown up.
        dispatch(getSingleProductDetails(productId));
        dispatch(getAllProducts());
      }
    })
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

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


  return (
    <Fragment>
      <MetaData title="Edit Product" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form className="createProductForm" encType="multipart/form-data" onSubmit={updateProductSubmitHandler} > 
            <h1>Edit Product</h1>

            <div>
              <SpellcheckIcon />
              <input type="text" placeholder="Product Name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <DiscountIcon />
              <input type="String" placeholder="Discount Percent *optional" onChange={(e) => setOfferPrice(e.target.value)} />
            </div>

            <div>
              <AttachMoneyIcon />
              <input type="number" placeholder="Product Price" required onChange={(e) => setPrice(e.target.value)} value={price} />
            </div>

            <div>
              <DescriptionIcon />
              <textarea placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} cols="30" rows="1" ></textarea>
            </div>

            <div>
              <AccountTreeIcon />
              <select value={category} onChange={(e) => setCategory(e.target.value)} >
                <option value="">Choose Category</option>
                {categories.map((cate) => (
                  <option key={cate} value={cate}>{cate}</option>
                ))}
              </select>
            </div>

            <div>
              <StorageIcon />
              <input type="number" placeholder="Stock" required onChange={(e) => setStock(e.target.value)} value={stock} />
            </div>

            <div id="createProductFormFile">
              <input type="file" name="avatar" accept="image/*" onChange={updateProductImagesChange} multiple />
            </div>

            <div id="createProductFormImage">
              {oldImages &&
                oldImages.map((image, index) => (
                  <img key={index} src={image.url} alt="Old Product Preview" />
                ))}
            </div>

            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>

            <Button id="createProductBtn" type="submit">
              Update
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProduct;