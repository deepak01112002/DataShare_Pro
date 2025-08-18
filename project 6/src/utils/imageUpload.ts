import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';
import imageCompression from 'browser-image-compression';

export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    // Compress image before upload
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.5, // target ~500KB
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      initialQuality: 0.7
    });

    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${compressedFile.name}`;
    const storageRef = ref(storage, `${path}/${filename}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, compressedFile);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    
    // Check if it's a CORS or storage configuration error
    if (error.code === 'storage/unauthorized' || 
        error.message?.includes('CORS') || 
        error.message?.includes('preflight')) {
      throw new Error('Firebase Storage not configured properly. Please use an image URL instead or configure Storage rules in Firebase Console.');
    }
    
    throw new Error('Failed to upload image. Please try using an image URL instead.');
  }
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Only try to delete if it's a Firebase Storage URL
    if (imageUrl.includes('firebasestorage.googleapis.com')) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error for deletion failures as it's not critical
  }
};

export const validateImageFile = (file: File): string | null => {
  const maxSize = 2 * 1024 * 1024; // 2MB (optimized for free plan)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, or WebP)';
  }
  
  if (file.size > maxSize) {
    return 'Image size must be less than 2MB';
  }
  
  return null;
};