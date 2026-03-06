const cloudinary = require('./cloudinaryConfig');

async function uploadImage(base64, folderName, publicId) {
  try {
    const result = await cloudinary.uploader.upload(base64, {
      folder: folderName,
      public_id: publicId  // Name the image with tripName
    });
    return result;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

module.exports = {
  uploadImage,
};
