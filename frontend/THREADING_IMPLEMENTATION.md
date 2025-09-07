# File Upload Threading Implementation

## Overview
This implementation adds Web Workers for file processing and uploading to improve performance and user experience. The system processes images and uploads files in separate threads to prevent UI blocking.

## Features

### 1. Web Workers for Threading
- **File Processing**: Images are compressed using OffscreenCanvas API in a separate thread
- **File Upload**: Upload operations run in background threads
- **Non-blocking UI**: Main thread remains responsive during file operations

### 2. Image Compression
- **Automatic Compression**: Images are automatically compressed before upload
- **Configurable Quality**: Compression quality can be adjusted (default: 80%)
- **Size Optimization**: Reduces file sizes while maintaining visual quality
- **Aspect Ratio Preservation**: Maintains original aspect ratios

### 3. Mobile-Friendly File Display
- **Responsive Truncation**: File names are truncated based on screen size
- **Dynamic Length**: Mobile (15 chars) vs Desktop (25 chars)
- **Tooltip Support**: Full file names shown on hover
- **Responsive Layout**: Adapts to different screen sizes

### 4. Progress Tracking
- **Individual Progress**: Each file shows its own upload progress
- **Status Indicators**: Visual indicators for pending, uploading, completed, and error states
- **Real-time Updates**: Progress updates in real-time
- **Error Handling**: Individual file failures don't affect other uploads

## Technical Implementation

### Web Worker (`fileUploadWorker.js`)
```javascript
// Handles file uploads and image processing
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'UPLOAD_FILE':
      handleFileUpload(data);
      break;
    case 'PROCESS_IMAGE':
      processImage(data);
      break;
  }
};
```

### FileUpload Component Features
- **Threading Support**: Uses Web Workers when available
- **Fallback Support**: Falls back to regular upload if Web Workers unavailable
- **Progress Tracking**: Real-time upload progress for each file
- **Mobile Optimization**: Responsive file name display
- **Error Handling**: Comprehensive error handling and user feedback

### Usage in Vendor Steps
All vendor registration steps now use the improved FileUpload component:

- **VendorStep1**: Image and video uploads with threading
- **VendorStep3**: Document uploads with progress tracking
- **VendorStep2 & VendorStep4**: Ready for file uploads if needed

## Browser Support
- **Modern Browsers**: Full Web Worker support
- **Legacy Browsers**: Automatic fallback to regular upload
- **Mobile Browsers**: Optimized for mobile file display

## Performance Benefits
1. **Non-blocking UI**: Main thread remains responsive
2. **Parallel Processing**: Multiple files can be processed simultaneously
3. **Image Optimization**: Reduced file sizes and faster uploads
4. **Better UX**: Real-time progress feedback and mobile optimization

## Testing
Use the `FileUploadTest` component to test the threading implementation:
- Upload multiple files simultaneously
- Observe progress tracking
- Test mobile responsiveness
- Verify image compression

## Configuration
The implementation can be configured by modifying:
- **Compression Quality**: In `fileUploadWorker.js`
- **File Size Limits**: In `FileUpload.jsx`
- **Mobile Truncation Length**: In `truncateFileName` function
- **Progress Update Frequency**: In worker message handlers
