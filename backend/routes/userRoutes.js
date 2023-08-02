const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const { createUserValidations, loginValidations, forgetPasswordValidations, resetPasswordValidations, updatePasswordValidations,
updateProfileValidations, getSingleUserValidation, updateUserRoleValidations, deleteUserValidations } = require('../validator/userValidation');
const { createUser, loginUser , logoutUser, forgetPassword, resetPassword, getUserDetail, updatePassword, updateProfile, 
getAllUsers, getSingleUser, updateUserRole, deleteUser } = require('../controller/userController');
const authorizedRoles = require('../middleware/authorizedRoles');

router.post('/create-user', createUserValidations, createUser);
router.post('/login', loginValidations, loginUser);
router.get('/logout', logoutUser);

router.post('/password/forget', forgetPasswordValidations, forgetPassword);
router.put('/password/reset/:token', resetPasswordValidations, resetPassword);

router.get('/me', checkAuth, getUserDetail);
router.put('/me/password/update', checkAuth, updatePasswordValidations, updatePassword);
router.put('/me/profile/update', checkAuth, updateProfileValidations, updateProfile);

router.get('/admin/users', checkAuth, authorizedRoles('admin'), getAllUsers); // Get all users.
router.get('/admin/user/:id', checkAuth, authorizedRoles('admin'), getSingleUserValidation, getSingleUser); // Get a single user with id.
router.put('/admin/user/:id', checkAuth, authorizedRoles('admin'), updateUserRoleValidations, updateUserRole); // Update User's role.
router.delete('/admin/user/:id', checkAuth, authorizedRoles('admin'), deleteUserValidations, deleteUser); // Delete a single user.

module.exports = router;