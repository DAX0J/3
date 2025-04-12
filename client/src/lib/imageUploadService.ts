import axios from 'axios';

// ImgBB API Key
const IMGBB_API_KEY = 'c71e5afc2ad434765e24c80f3702e816';
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

/**
 * Upload an image to ImgBB
 * @param imageFile - The image file to upload
 * @param name - Optional name for the image
 * @param expiration - Optional expiration time in seconds (60-15552000)
 * @returns Promise with the uploaded image data
 */
export const uploadImage = async (
  imageFile: File,
  name?: string,
  expiration?: number
): Promise<{
  id: string;
  url: string;
  display_url: string;
  delete_url: string;
  success: boolean;
}> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    if (name) {
      formData.append('name', name);
    }
    
    let url = `${IMGBB_API_URL}?key=${IMGBB_API_KEY}`;
    
    if (expiration && expiration >= 60 && expiration <= 15552000) {
      url += `&expiration=${expiration}`;
    }
    
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    if (response.data && response.data.success) {
      return {
        id: response.data.data.id,
        url: response.data.data.url,
        display_url: response.data.data.display_url,
        delete_url: response.data.data.delete_url,
        success: true
      };
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Upload an image using base64 data
 * @param base64Data - Base64 image data
 * @param name - Optional name for the image
 * @param expiration - Optional expiration time in seconds
 * @returns Promise with the uploaded image data
 */
export const uploadBase64Image = async (
  base64Data: string,
  name?: string,
  expiration?: number
): Promise<{
  id: string;
  url: string;
  display_url: string;
  delete_url: string;
  success: boolean;
}> => {
  try {
    // Remove any prefixes like "data:image/jpeg;base64,"
    const base64Image = base64Data.includes('base64,') 
      ? base64Data.split('base64,')[1] 
      : base64Data;
    
    let url = `${IMGBB_API_URL}?key=${IMGBB_API_KEY}`;
    
    if (expiration && expiration >= 60 && expiration <= 15552000) {
      url += `&expiration=${expiration}`;
    }
    
    const response = await axios.post(url, {
      image: base64Image,
      name: name || undefined
    });
    
    if (response.data && response.data.success) {
      return {
        id: response.data.data.id,
        url: response.data.data.url,
        display_url: response.data.data.display_url,
        delete_url: response.data.data.delete_url,
        success: true
      };
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};