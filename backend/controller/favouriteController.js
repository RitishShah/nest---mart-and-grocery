const Favourite = require('../models/favouriteModel');
const utils = require('../utils/response');

exports.pushFavouriteProductsFromLocalStorageToDatabase = async (req, res) => {
    const userId = req.user._id;

    console.log("Local", req.body);
    const localStorageItems = req.body.favouriteItems;
    console.log(localStorageItems);
    const favourite = await Favourite.findOne({userId: userId});

    if(!favourite) {
        const favourite = new Favourite({
            userId: userId,
            cartItems: localStorageItems,
        });
        await favourite.save();
    } else {
        favourite.favouriteItems = localStorageItems;
        await favourite.save();
    }
    
    utils.response(res, 'success', "LocalStorage Items are added to Favourite db Successfully", favourite, 200);
}

exports.pushFavouriteProductsFromDatabaseToLocalStorage = async (req, res) => {
    const userId = req.user._id;
    const favourite = await Favourite.findOne({userId: userId});
    let favouriteItems = [];
    if(favourite) {
        favouriteItems = favourite.favouriteItems;
    }

    utils.response(res, 'success', "Cart Items Sent Successfully", favouriteItems, 200);
}