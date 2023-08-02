import React, { Fragment, useEffect } from "react";
// import { DataGrid } from "@material-ui/data-grid";
import { DataGrid } from "@mui/x-data-grid";
import "./AllProducts.css";
import { useSelector, useDispatch } from "react-redux";
// import { clearErrors, deleteProduct, getAdminProduct } from "../../actions/ProductActions";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import MetaData from "../../more/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { toast } from 'react-toastify';
import StatusCode from "../../redux/StatusCode";
import { deleteProductDetails, resetDeleteProduct } from "../../redux/deleteProductSlice";
// import { getAllProducts } from "../../redux/allProductsSlice";
// import { DELETE_PRODUCT_RESET } from "../../constans/ProductConstans";


const AllProducts = () => {
    const history = useNavigate();
    const dispatch = useDispatch();
    // const { error, products } = useSelector((state) => state.AllProducts);
    const { data: products, status } = useSelector(state => state.allProducts);
    const {  isDeleted } = useSelector((state) => state.deleteProduct);

    const deleteProductHandler = (id) => {
        dispatch(deleteProductDetails(id));
    };

    useEffect(() => {
        // if (error) {
        // toast.error(error);
        // // dispatch(clearErrors());
        // }
        // if (deleteError) {
        //     toast.error(deleteError);
        //     // dispatch(clearErrors());
        // }
    
        if (isDeleted) {
            toast.success("Product Deleted Successfully");
            history("/dashboard");
            dispatch(resetDeleteProduct());
        }
        // dispatch(getAllProducts());
    }, [dispatch, isDeleted, history]);

    const columns = [
        { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },
        { field: "name", headerName: "Name", minWidth: 350, flex: 1, },
        { field: "stock", headerName: "Stock", type: "number", minWidth: 150, flex: 0.3,},
        { field: "price", headerName: "Price", type: "number", minWidth: 270, flex: 0.5, },
        { field: "actions", flex: 0.3, headerName: "Actions", minWidth: 150, type: "number", sortable: false,
            renderCell: (params) => {
                console.log("Data Grid params", params);
            return (
              <Fragment>
                <Link to={`/admin/edit/product/${params.row.id}`}>
                  <EditIcon />
                </Link>
                <Button onClick={() => deleteProductHandler(params.row.id)}>
                  <DeleteIcon />
                </Button>
              </Fragment>
            );},
        },
    ];

  const rows = [];

  products && 
  products.forEach((item) => {
    rows.push({
        id: item._id,
        stock: item.stock,
        price: item.price,
        name: item.name,
      });
    });

    if(status === StatusCode.LOADING) {
        return <p>Loading...</p>
    }
  
    if(status === StatusCode.ERROR) {
        return <p>Something went wrong! try again later</p>
    }

    return (
        <Fragment>
            <MetaData title={`ALL PRODUCTS - Admin`} />
            <div className="dashboard">
                <SideBar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL PRODUCTS</h1>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        // pageSize={10}
                        // disableSelectionOnClick
                        className="productListTable"
                        // autoHeight
                        // {...products}
                        // initialState={{
                        //   ...products.initialState,
                        //   pagination: {
                        //     ...products.initialState?.pagination,
                        //     paginationModel: {
                        //       pageSize: 10,
                        //     },
                        //   },
                        // }}
                    />
                </div>
            </div>
        </Fragment>
    )
}

export default AllProducts