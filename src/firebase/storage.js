import { storage } from './config';
// Using Cloudinary instead of Firebase Storage

export const uploadProfileImage = async (userId, file) => {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'dev_connect_unsigned'); // Create this preset in Cloudinary dashboard
    formData.append('folder', `dev-connect/${userId}`);
    
    // Upload to Cloudinary via their API
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading profile image: ", error);
    throw error;
  }
};

export const deleteImage = async (imageUrl) => {
  try {
    // Extract public_id from URL
    const splitUrl = imageUrl.split('/');
    const fileName = splitUrl[splitUrl.length - 1].split('.')[0];
    const folderPath = splitUrl[splitUrl.length - 2];
    const publicId = `${folderPath}/${fileName}`;
    
    // You would typically need a server endpoint to handle deletion
    // as Cloudinary API requires authentication
    const response = await fetch('/api/delete-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error deleting image: ", error);
    throw error;
  }
};