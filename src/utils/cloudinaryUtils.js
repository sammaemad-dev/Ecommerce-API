const cloudinary = require("../config/cloudinary.js");
const fs = require("fs/promises");

// Upload a file to Cloudinary
const uploadToCloudinary = async (filePath, folder) => {
  try {
    if (!filePath) throw new Error("No file provided for upload.");

    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: "auto", // Automatically detects images, videos, etc.
    });

    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (err) {
    // Handle Cloudinary Errors
    console.error("Cloudinary upload error:", err);
    throw new Error(`Cloudinary upload failed: ${err.message}`);
  } finally {
    try {
      await fs.unlink(filePath); //aya: to remove temporary file whether the upload succeeds or fails,
    } catch (err) {
      console.warn(`Could not delete temporary file: ${filePath}`);
    }
  }
};

// Deletes an image from Cloudinary using its public_id
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) throw new Error("No public_id provided for deletion.");

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new Error(
        `Cloudinary could not delete the image (Status: ${result.result})`,
      );
    }

    return result;
  } catch (err) {
    // Handle Cloudinary Errors
    throw new Error(`Cloudinary deletion failed: ${err.message}`);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
