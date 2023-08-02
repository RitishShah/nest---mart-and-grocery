const User = require('../models/userModel');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const utils = require('../utils/response');
const jwtTokenCookie = require('../utils/jwtTokenCookie');
const nodeMailer = require('../utils/sendMail');
const cloudinary = require('cloudinary');
dotenv.config({
    path:"backend/config/.env"
})

// Sign Up User
exports.createUser = async (req, res) => {
    const bodyData = req.body;
    const name = bodyData.name;
    const email = bodyData.email;
    const password = bodyData.password;
    const avatar = bodyData.avatar;

    console.log(bodyData);
    console.log(avatar);
    const user = await User.find({email: email});

    if(user.length > 0) {
      return utils.response(res, 'fail', 'Mail already exists !!', null, 404);
    }

    try {
      let result = null;
      if(avatar != '/profile.png') {
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale"
        });

        console.log("Try avatar");
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          name,
          email,
          password,
          avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
          }
        });
        console.log("YA bish");
        result = await user.save();
        console.log(result);
        console.log("After bish");
      } else {
        console.log("NOt avatara");
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            name,
            email,
            password
          });
          result = await user.save();
        }
        console.log("After Try");
      const token = jwt.sign({ userid: result._id }, process.env.JWT_KEY, { expiresIn: "24h" });
      console.log("asasdasdasdasdasdas")
      jwtTokenCookie.sendToken(res,token);
      utils.response(res, 'success', 'User Created', token, 200);
    } catch (error) {
      utils.response(res, 'fail', error.message, null, 403);
    }
}

// Sign In User
exports.loginUser = async (req, res) => {
  const bodyData = req.body;
  const user = await User.find({email: bodyData.email}, "-__v");

  console.log(user);
  console.log(bodyData);
  // console.log(bodyData.email);
  // console.log(bodyData.password);

  if(user.length > 0) {
    bcrypt.compare(bodyData.password, user[0].password, (error, result) => {
      if (error) {
        return utils.response(res, 'fail', 'Auth Failed', null, 401);
      }
      if (result) {
        const token = jwt.sign({ email: user[0].email, userid: user[0]._id }, process.env.JWT_KEY, { expiresIn: "24h" });
        const data = user[0];
        jwtTokenCookie.sendToken(res,token);
        return utils.response(res, 'success', "Auth Successful", data, 200);
      } else {
        utils.response(res, 'fail', "Password not matching with database", null, 400);
      }
    });
  } else {
    utils.response(res, 'fail', "User Not Found", null, 404);
  }
}

// Sign Out User
exports.logoutUser = async (req, res) => {
  res.cookie("jwt", null, {
    expires: new Date(Date.now()),
    httpOnly:true
  });
  utils.response(res,'success','User logout', null, 200);
}

// Forget Password
exports.forgetPassword = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });

  if(!user) {
    return utils.response(res, 'fail', "User Not Found", null, 404);
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
  const resetPasswordTime = Date.now() + (15 * 60 * 1000);
  await User.updateOne({ email: email }, {$set : {resetPasswordToken: resetTokenHash, resetPasswordTime: resetPasswordTime}});

  const resetPasswordLink = `${req.protocol}://${req.get('host')}/api/v2/password/reset/${resetToken}`;
  const resetPasswordMessage = `Your Password Reset Link :- \n\n ${resetPasswordLink}`;

  try {
    const options = { email: email, subject: "Ecommerce Password Recovery", message: resetPasswordMessage };
    await nodeMailer.sendMail(options);
    utils.response(res, 'success', `Email send successfully to ${email}`, options, 200);
  } catch (error) {
    await User.updateOne({ email: email }, {$set: {resetPasswordToken: null, resetPasswordTime: null}});
    utils.response(res, 'fail', error.message, null, 401);
  }
}

// Reset Password
exports.resetPassword = async (req, res) => {
  const token = req.params.token;
  const hashPassword = req.body.password;
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({ resetPasswordToken: resetPasswordToken, resetPasswordTime: { $gt: Date.now() } });

  if(!user) {
    return utils.response(res, 'fail', "Reset Password link is invalid or expired", null, 400);
  }

  try {
    const update = await User.updateOne({ email:user.email }, { $set: { resetPasswordToken: null, resetPasswordTime: null, password: hashPassword } });
    utils.response(res, 'success', 'Password Changed Successfully', update, 200);
  } catch (error) {
    utils.response(res, 'fail', error.message, null, 400);
  }
}

// Get User(myself) Details
exports.getUserDetail = async (req, res) => {
  const user = await User.findById(req.user.id);
  utils.response(res, 'success', 'User found', user, 200);
}

// Update Password
exports.updatePassword = async (req, res) => {
  const bodyData = req.body;
  const oldPassword = bodyData.oldPassword;
  const newPassword = bodyData.newPassword;
  const decode = req.userData; 
  const user = await User.findOne({_id: decode.userid},"-__v");
  console.log(user);
  bcrypt.compare(oldPassword, user.password, async (error, result) => {
    if(error) {
      return utils.response(res, 'fail', "Auth Failed", null, 401);
    }
    if(result) {
      const update = await User.updateOne({email: user.email}, {$set: {password: newPassword}});
      utils.response(res, 'success', "Password Updated Successfully", update, 200);
    } else {
      return utils.response(res, 'fail', "Old Password not matching with database", null, 400);
    }
  });
}

// Update Profile
exports.updateProfile = async (req, res) => {
  const bodyData = req.body;
  const name = bodyData.name;
  const email = bodyData.email;
  const avatar = bodyData.avatar;

  console.log("Inside Update Route Backend");
  console.log(avatar);

  const newUserData = {
    name: bodyData.name,
    email: bodyData.email
  };

  const isPresent = await User.find({email: email});

  if(isPresent.length > 0) {
    return utils.response(res, 'fail', "User with this E-mail already exist in dB", null, 403);
  }

  if (avatar) {
    const user = await User.findById(req.user.id);
    console.log(user.avatar);

    if(Object.keys(user.avatar).length !== 0 && user.avatar.constructor === Object) {
      console.log("avatardsfsdfs")
      const imageId = user.avatar.public_id;
      await cloudinary.v2.uploader.destroy(imageId);
    }

    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    
    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidator: true,
    useFindAndModify: false
  });
  const updatedData = await User.find({email: email});
  console.log(updatedData[0]);
  utils.response(res, 'success', "Profile Updated Successfully", updatedData[0], 200);
}

// Get All Users ---Admin
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  utils.response(res, 'success', "All Users", users, 200);
}

// Get Single User ---Admin
exports.getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if(!user) {
    return utils.response(res, 'fail', "User is not found with this id", null, 400);
  }

  utils.response(res, 'success', "User found with this id", user, 200);
}

// Change User Role ---Admin
exports.updateUserRole = async (req, res) => {
  const bodyData = req.body;
  const name = bodyData.name;
  const role = bodyData.role;
  const id = req.params.id;
  const isPresent = await User.findById(id);
  
  if(!isPresent) {
    return utils.response(res, 'fail', "User with this id does not exist in dB", null, 400);
  }

  await User.findByIdAndUpdate(req.params.id, {$set: {name: name, role: role}});
  utils.response(res, 'success', "Profile Updated Successfully", bodyData, 200);
}

// Delete User ---Admin
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);

  console.log("user", user);

  if(!user) {
    return utils.response(res, 'fail', "User with this id does not exist in dB", null, 400);
  }

  const userArray = Object.keys(user);

  if(userArray.includes('avatar')) {
    console.log("Inside avatar of deleted user");
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
  }

  await User.deleteOne({_id:user._id});
  utils.response(res, 'success', "User deleted Successfully", user, 200);
}