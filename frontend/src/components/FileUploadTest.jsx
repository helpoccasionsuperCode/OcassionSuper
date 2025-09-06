import React, { useState } from 'react';
import FileUpload from './VendorRegister/FileUpload';
import { toast } from 'react-toastify';

const FileUploadTest = () => {
  const [uploadedFiles, setUploadedFiles] = useState({
    images: [],
    videos: [],
    documents: []
  });

  const handleImageUpload = (urls) => {
    setUploadedFiles(prev => ({ ...prev, images: urls || [] }));
  };

  const handleVideoUpload = (urls) => {
    setUploadedFiles(prev => ({ ...prev, videos: urls || [] }));
  };

  const handleDocumentUpload = (urls) => {
    setUploadedFiles(prev => ({ ...prev, documents: urls || [] }));
  };

  const handleSubmit = () => {
    const payload = {
      images: uploadedFiles.images,
      videos: uploadedFiles.videos,
      documents: uploadedFiles.documents,
      timestamp: new Date().toISOString()
    };

    console.log('Uploaded files payload:', payload);
    toast.info('Check console for uploaded files data!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          File Upload Test Page
        </h1>
        
        <p className="text-center text-gray-600 mb-8">
          This page demonstrates the Cloudinary file upload functionality. 
          Upload files and see how the URLs are captured and stored.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Upload */}
          <div>
            <FileUpload
              label="Test Image Upload"
              description="Upload multiple images to test the functionality"
              onFileSelect={handleImageUpload}
              required={false}
            />
          </div>

          {/* Video Upload */}
          <div>
            <FileUpload
              label="Test Video Upload"
              description="Upload multiple videos to test the functionality"
              onFileSelect={handleVideoUpload}
              required={false}
            />
          </div>

          {/* Document Upload */}
          <div className="lg:col-span-2">
            <FileUpload
              label="Test Document Upload"
              description="Upload documents (PDF, DOC, images) to test the functionality"
              onFileSelect={handleDocumentUpload}
              required={false}
            />
          </div>
        </div>

        {/* Results Display */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Uploaded Files Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Images ({uploadedFiles.images.length})</h4>
              {uploadedFiles.images.length > 0 ? (
                <ul className="text-sm text-green-600 space-y-1">
                  {uploadedFiles.images.map((url, idx) => (
                    <li key={idx} className="break-all">✅ {url}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No images uploaded</p>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Videos ({uploadedFiles.videos.length})</h4>
              {uploadedFiles.videos.length > 0 ? (
                <ul className="text-sm text-green-600 space-y-1">
                  {uploadedFiles.videos.map((url, idx) => (
                    <li key={idx} className="break-all">✅ {url}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No videos uploaded</p>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Documents ({uploadedFiles.documents.length})</h4>
              {uploadedFiles.documents.length > 0 ? (
                <ul className="text-sm text-green-600 space-y-1">
                  {uploadedFiles.documents.map((url, idx) => (
                    <li key={idx} className="break-all">✅ {url}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No documents uploaded</p>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Submit (Check Console)
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">How to Test</h3>
          <ol className="text-blue-700 space-y-2 list-decimal list-inside">
            <li>Upload some files using the upload components above</li>
            <li>Watch as files are uploaded to Cloudinary and URLs are generated</li>
            <li>See the URLs displayed in the summary section</li>
            <li>Click "Test Submit" to see the data structure in the console</li>
            <li>This simulates what would be sent to your backend</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default FileUploadTest;
