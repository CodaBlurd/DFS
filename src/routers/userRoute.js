const express = require('express');
const multer = require('multer');
const AppError = require('../helper/appErrors');
const { auth } = require('../middleware/auth');
const {
    signup, updateUser, imageUpload, fileUp,
    getUserImage, getUser, getAllUsers, loginUser,
    logOut, deleteImageUploaded, deleteUser, getFreelancer
} = require('../controllers/userCtrl');
const { topFreelancersByReviews } = require('../controllers/bidCtrl');

const router = new express.Router();

const upload = multer({
    limits: { fileSize: 1000000 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|docx)$/)) {
            return cb(new AppError('Only jpg, jpeg, png, and docx files are allowed', 400));
        }
        cb(undefined, true);
    }
});

// User authentication routes
router.post('/signup', signup);
router.post('/login', loginUser);
router.post('/logout', auth, logOut);

// User profile management
router.patch('/me', auth, upload.array('portfolio'), fileUp, updateUser);
router.post('/me/avatar', auth, upload.single('avatar'), imageUpload);

// Error handling middleware for image upload
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return next(new AppError(error.message, 400));
    }
    next(error);
});

// User data retrieval
router.get('/:id/avatar', getUserImage);
router.get('/me', auth, getUser);
router.get('/', getAllUsers);
router.get('/freelancers/:id', auth, getFreelancer);
router.get('/top-freelancers', topFreelancersByReviews);

// User data deletion
router.delete('/me/avatar', auth, deleteImageUploaded);
router.delete('/me', auth, deleteUser);

module.exports = router;
