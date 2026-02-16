import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, faTrash, faImage, faSpinner, faCheckCircle, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import cloudinaryService from '../../services/cloudinaryService';
import toast from 'react-hot-toast';

const ImageUpload = ({ 
  studentId, 
  type = 'photo', 
  currentImageUrl = null, 
  onUploadSuccess, 
  onDeleteSuccess,
  className = '',
  disabled = false 
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState(currentImageUrl);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const validation = cloudinaryService.validateImageFile(file, type);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    handleUpload(file);
  };

  const handleUpload = async (file) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await cloudinaryService.uploadWithProgress(
        studentId,
        file,
        type,
        (progress) => setUploadProgress(progress)
      );

      if (result.success) {
        setImageUrl(result.data.url);
        toast.success(`${type === 'photo' ? 'Photo' : 'ID Proof'} uploaded successfully!`);
        
        if (onUploadSuccess) {
          onUploadSuccess(result.data);
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete this ${type === 'photo' ? 'photo' : 'ID proof'}?`)) {
      return;
    }

    try {
      const result = await cloudinaryService.deleteStudentImage(studentId, type);
      
      if (result.success) {
        setImageUrl(null);
        toast.success(result.message);
        
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Delete failed. Please try again.');
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current && !disabled && !uploading) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={type === 'photo' ? 'image/*' : 'image/*,application/pdf'}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Upload area */}
      <div className="relative">
        {imageUrl ? (
          // Show existing image
          <div className="relative group">
            <img
              src={imageUrl}
              alt={type === 'photo' ? 'Student Photo' : 'ID Proof'}
              className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-4">
              <button
                onClick={triggerFileInput}
                disabled={disabled || uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                Replace
              </button>
              <button
                onClick={handleDelete}
                disabled={disabled || uploading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        ) : (
          // Show upload area
          <div
            onClick={triggerFileInput}
            className={`w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors ${
              disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <div className="text-center">
                <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 mb-4 animate-spin" />
                <p className="text-gray-600 mb-2">Uploading...</p>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{uploadProgress}%</p>
              </div>
            ) : (
              <div className="text-center">
                <FontAwesomeIcon icon={faImage} className="text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">
                  Click to upload {type === 'photo' ? 'photo' : 'ID proof'}
                </p>
                <p className="text-sm text-gray-500">
                  {type === 'photo' 
                    ? 'JPG, PNG, GIF up to 5MB' 
                    : 'JPG, PNG, GIF, PDF up to 5MB'
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload status */}
      {uploading && (
        <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg">
          <FontAwesomeIcon icon={faSpinner} className="text-blue-600 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;