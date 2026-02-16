/**
 * Cloudinary service for handling image uploads and management
 */
import api from './api';
import toast from 'react-hot-toast';

class CloudinaryService {
  /**
   * Upload student photo
   * @param {number} studentId - Student ID
   * @param {File} file - Image file
   * @returns {Promise} Upload result
   */
  async uploadStudentPhoto(studentId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_type', 'photo');

      const response = await api.post(
        `/api/v1/students/${studentId}/upload-image/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Photo upload error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to upload photo',
      };
    }
  }

  /**
   * Upload student ID proof
   * @param {number} studentId - Student ID
   * @param {File} file - Document file
   * @returns {Promise} Upload result
   */
  async uploadStudentIdProof(studentId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_type', 'id_proof');

      const response = await api.post(
        `/api/v1/students/${studentId}/upload-image/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('ID proof upload error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to upload ID proof',
      };
    }
  }

  /**
   * Delete student image
   * @param {number} studentId - Student ID
   * @param {string} type - Image type ('photo' or 'id_proof')
   * @returns {Promise} Delete result
   */
  async deleteStudentImage(studentId, type) {
    try {
      const response = await api.delete(
        `/api/v1/students/${studentId}/delete-image/?type=${type}`
      );

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Image delete error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete image',
      };
    }
  }

  /**
   * Get student image URLs
   * @param {number} studentId - Student ID
   * @returns {Promise} Image URLs
   */
  async getStudentImageUrls(studentId) {
    try {
      const response = await api.get(`/api/v1/students/${studentId}/image-urls/`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Get image URLs error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get image URLs',
      };
    }
  }

  /**
   * Validate image file before upload
   * @param {File} file - File to validate
   * @param {string} type - Upload type ('photo' or 'id_proof')
   * @returns {Object} Validation result
   */
  validateImageFile(file, type = 'photo') {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = {
      photo: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
      id_proof: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'],
    };

    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }

    if (!allowedTypes[type].includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: ${allowedTypes[type].join(', ')}`,
      };
    }

    return { valid: true };
  }

  /**
   * Upload with progress tracking
   * @param {number} studentId - Student ID
   * @param {File} file - File to upload
   * @param {string} type - Upload type ('photo' or 'id_proof')
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} Upload result
   */
  async uploadWithProgress(studentId, file, type, onProgress) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_type', type);

      const response = await api.post(
        `/api/v1/students/${studentId}/upload-image/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            if (onProgress) {
              onProgress(percentCompleted);
            }
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Upload with progress error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Upload failed',
      };
    }
  }

  /**
   * Batch upload multiple images
   * @param {Array} uploads - Array of {studentId, file, type}
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} Batch upload results
   */
  async batchUpload(uploads, onProgress) {
    const results = [];
    let completed = 0;

    for (const upload of uploads) {
      try {
        const result = await this.uploadWithProgress(
          upload.studentId,
          upload.file,
          upload.type,
          (progress) => {
            if (onProgress) {
              const overallProgress = Math.round(
                ((completed + progress / 100) / uploads.length) * 100
              );
              onProgress(overallProgress, upload.studentId);
            }
          }
        );

        results.push({
          studentId: upload.studentId,
          type: upload.type,
          ...result,
        });

        completed++;
      } catch (error) {
        results.push({
          studentId: upload.studentId,
          type: upload.type,
          success: false,
          error: error.message,
        });
        completed++;
      }
    }

    return results;
  }

  /**
   * Get optimized image URL
   * @param {string} publicId - Cloudinary public ID
   * @param {string} preset - Size preset (thumbnail, profile, card, full)
   * @returns {string} Optimized image URL
   */
  getOptimizedUrl(publicId, preset = 'profile') {
    if (!publicId) return null;

    const presets = {
      thumbnail: 'w_150,h_150,c_fill,f_auto,q_auto',
      profile: 'w_300,h_300,c_fill,f_auto,q_auto',
      card: 'w_400,h_300,c_fill,f_auto,q_auto',
      banner: 'w_1200,h_400,c_fill,f_auto,q_auto',
      full: 'w_800,h_600,c_limit,f_auto,q_auto',
    };

    const transformation = presets[preset] || presets.profile;
    
    // Using the actual cloud name from the .env configuration
    return `https://res.cloudinary.com/dxhsqosdt/image/upload/${transformation}/${publicId}`;
  }
}

export default new CloudinaryService();