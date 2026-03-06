const fs = require('fs');

function convertImageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    return `data:image/jpeg;base64,${base64Image}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}

module.exports = {
    convertImageToBase64,
  };
