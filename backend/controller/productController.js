const Product = require('../models/productModel');
const utils = require('../utils/response');
const Features = require('../utils/features');
const cloudinary = require('cloudinary');

// Create New Product ---Admin
exports.createProduct = async(req,res,next) => {
  let images = req.body.images;

  console.log("Create product images url", req.body.images);

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    console.log(images[i]);
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;
  
  const product = await Product.create(req.body);
  utils.response(res,'success','Product Created',product,201);
};

// To Fetch All products in db
exports.getAllProducts = async (req, res) => {
  const products = await Product.find({});
  utils.response(res,'success','All Products',products,200);
};

// To Fetch products with searching, filtering and pagination.
exports.getFilteredProducts = async (req, res) => {
  const resultPerPage = 8;
  console.log("Hello");
  const totalProducts = await Product.countDocuments();
  const features = new Features(Product.find(), req.query).search().filter().pagination(resultPerPage);
  console.log("Middle");
  const products = await features.query;
  const data = { "products": products, "totalProducts": totalProducts };
  utils.response(res,'success','All Products',data,200);
};

// To Update a Product ---Admin
exports.updateProduct = async (req, res) => {
  let product = await Product.findById(req.params.id);
  if(!product) {
      return utils.response(res,'fail','Product is not found with this Id',null,404);
  }

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Delete image from cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new:true,
    runValidators:true,
    useUnified:false
  });

  utils.response(res,'success','Product is Updated',product,200);
}

// To Delete a Product ---Admin
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if(!product) {
    return utils.response(res,'success','Product is not found with this Id',null,404);
  }

    // Deleting images from cloudinary
    for (let i = 0; 1 < product.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        product.images[i].public_id
      );
    }

  const deletedProduct = await product.deleteOne();
  utils.response(res,'success','Product is deleted successfully',deletedProduct,200);
}

// Single Product Detail
exports.getSingleProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if(!product) {
      return utils.response(res,'fail','Product is not found with this Id',null,404);
  }

  utils.response(res,'success','Single Product',{productId: product.id, product: product},200);
}

// Create Review Or Update Review
exports.createProductReview = async (req, res) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment: comment,
  };

  const product = await Product.findById(productId);
  if(!product) {
    return utils.response(res, 'fail', "Product not found with this id", null, 404);
  }

  const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating);
        (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.rating = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  utils.response(res,'success','Reviews Updated',product,200);
}

// Get All Reviews of a Single Product
exports.getSingleProductReviews = async (req, res) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return utils.response(res,'fail','Product is not found with this Id',null,404);
  }

  utils.response(res,'success','Get All Reviews',{productId : product.id,  productReviews: product.reviews},200);
};

// Delete Single Review of a Single Product
exports.deleteReviews = async (req, res) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return utils.response(res,'fail','Product is not found with this Id',null,404);
    }
    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.reviewId.toString());
    let avg = 0;
    reviews.forEach((rev) => { avg += rev.rating });
    let rating = 0;
  
    if (reviews.length === 0) {
      rating = 0;
    } else {
      rating = avg / reviews.length;
    }
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, { reviews, rating, numOfReviews }, { new: true, runValidators: true, useFindAndModify: false, });
    utils.response(res, 'success', "Product Review is Deleted", null, 200);
}