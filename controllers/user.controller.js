const User = require('../modules/user.model');
const catchAsync = require('../utils/catchAsync');

//FOR USERS

// get current user
exports.getCurrentUser = catchAsync(async (req, res, next) => {
    req.params.id = req.user.id;
    next();
});

// Update user profile
exports.updateProfile = catchAsync(async (req, res, next) => {
    // find user and update
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { name: req.body.name, email: req.body.email, phone: req.body.phone }, { new: true });
    // send respons
    res.status(200).json({ success: true, data: updatedUser });
});

// Delete user profile
exports.deleteProfile = catchAsync(async (req, res, next) => {
    // find user and inactive
    await User.findByIdAndUpdate(req.user.id, { active: false });
    // send respons
    res.status(204).json({ success: true, data: null });
});

// Get user by ID
exports.getUser = catchAsync(async (req, res, next) => {
    // Request data
    const id = req.params.id;
    // check for user existence
    const user = await User.findById(id);
    if (!user) return next(new Error(`No User for this id ${id}`, { cause: 404 }));
    // send respons
    res.status(200).json({ success: true, data: user });
});

// FOR ADMIN

// create user
exports.createUser = catchAsync(async (req, res, next) => {
    // create user
    const newUser = await User.create(req.body);
    // send respons
    res.status(201).json({ success: true, data: newUser });
});

// get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
    // find all users
    const users = await User.find();
    if (!users.length) return next(new Error('Users Not Found', { cause: 404 }));
    // send respons
    res.status(200).json({ success: true, results: users.length, data: users });
});

// updateUser
exports.updateUser = catchAsync(async (req, res, next) => {
    // find user and update
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return next(new Error(`No userument for this id ${req.params.id}`, { cause: 404 }));
    // send respons
    res.status(200).json({ success: true, data: user });
});

// delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
    // find user and delete
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new Error('this userument Not Found', { cause: 404 }));
    // send respons
    res.status(204).json({ success: true, data: 'This User Deleted' });
});
