import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import apiClient from '../api/client';

// Default compression settings
const DEFAULT_COMPRESSION = {
  quality: 0.8,
  maxWidth: 1200,
  maxHeight: 1200,
};

/**
 * Compresses an image using Expo Image Manipulator
 */
export const compressImage = async (
  uri: string,
  options = DEFAULT_COMPRESSION
): Promise<string> => {
  const { quality, maxWidth, maxHeight } = options;
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth, height: maxHeight } }],
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    return uri; // Return original if compression fails
  }
};

/**
 * Gets file info from URI
 */
export const getFileInfo = async (fileUri: string) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    return fileInfo;
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
};

/**
 * Creates form data for image upload
 */
export const createImageFormData = (
  uri: string,
  fieldName = 'image',
  fileName?: string,
  mimeType = 'image/jpeg'
) => {
  const formData = new FormData();
  
  // Get proper file name or generate one
  const name = fileName || uri.split('/').pop() || `image-${Date.now()}.jpg`;
  
  // Create blob URI for iOS if needed
  const imgUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
  
  // Append file to form data
  formData.append(fieldName, {
    uri: imgUri,
    name,
    type: mimeType,
  } as any);
  
  return formData;
};

/**
 * Uploads image to server
 */
export const uploadImage = async (
  imageUri: string,
  uploadUrl: string,
  fieldName = 'image',
  additionalData = {}
): Promise<any> => {
  try {
    // First compress the image
    const compressedUri = await compressImage(imageUri);
    
    // Create form data
    const formData = createImageFormData(compressedUri, fieldName);
    
    // Add any additional data
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    
    // Upload image
    const response = await apiClient.post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Saves image to device gallery
 */
export const saveImageToGallery = async (imageUri: string): Promise<boolean> => {
  try {
    // Request permissions first
    const { status } = await MediaLibrary.requestPermissionsAsync();
    
    if (status !== 'granted') {
      console.error('Media library permission not granted');
      return false;
    }
    
    // Save to gallery
    await MediaLibrary.saveToLibraryAsync(imageUri);
    return true;
  } catch (error) {
    console.error('Error saving image to gallery:', error);
    return false;
  }
}; 