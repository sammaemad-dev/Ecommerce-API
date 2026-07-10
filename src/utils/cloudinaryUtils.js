import cloudinary from '../config/cloudinary.js';

// Upload a file to Cloudinary
export const uploadToCloudinary = async (filePath, folder = 'products') => {
  try {
    if (!filePath) throw new Error("No file provided for upload.");

    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto', // Automatically detects images, videos, etc.
    });

    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (err) {
    // Handle Cloudinary Errors
    console.error("Cloudinary upload error:", err);
    throw new Error(`Cloudinary upload failed: ${err.message}`);
  }
};

// Deletes an image from Cloudinary using its public_id
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) throw new Error("No public_id provided for deletion.");

    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result !== 'ok') {
      throw new Error(`Cloudinary could not delete the image (Status: ${result.result})`);
    }

    return result;
  } catch (err) {
    // Handle Cloudinary Errors
    throw new Error(`Cloudinary deletion failed: ${err.message}`);
  }
};