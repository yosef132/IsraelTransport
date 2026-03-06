const express = require('express');
const { uploadImageController } = require('./ImageUpload.Controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

const router = express.Router();

router.post('/UploadImage', upload.single('image'), uploadImageController);

module.exports = router;
