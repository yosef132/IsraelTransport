const fs = require('fs');
const { convertImageToBase64 } = require('./convertImageToBase64'); 
const { uploadImage } = require('./uploadImage'); 

async function uploadImageController(req, res) {
    const { tripName } = req.body;  
    const imagePath = req.file?.path;

    if (!imagePath) {
        return res.status(400).send({ error: 'Image file, trip name, and folder name are required' });
    }
    try {
        const base64Image = convertImageToBase64(imagePath);
        const uploadResult = await uploadImage(base64Image, folderName = 'Trips', tripName);
        
        const imageURL = uploadResult.secure_url;
        fs.unlinkSync(imagePath); 
        res.status(201).send({ message: 'Image uploaded successfully', imageURL });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
}

module.exports = { uploadImageController };
