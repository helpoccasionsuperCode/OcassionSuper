# Cloudinary File Upload Implementation Guide

## Overview

This implementation provides a complete file upload solution using Cloudinary for storing images, videos, and documents. Files are uploaded directly to Cloudinary from the frontend, and the resulting URLs are stored in your database.

## How It Works

### 1. Frontend File Selection
- Users select files using the enhanced `FileUpload` component
- Files are validated for type and size
- Multiple files can be selected at once

### 2. Cloudinary Upload
- Selected files are automatically uploaded to Cloudinary via the `/api/upload` endpoint
- Files are organized in a `vendor_uploads` folder on Cloudinary
- Secure URLs are generated for each uploaded file

### 3. URL Storage
- Cloudinary URLs are stored in the component state
- URLs are displayed to users for confirmation
- When the form is submitted, URLs are sent to the backend

### 4. Database Storage
- Cloudinary URLs are stored in the database as strings
- No actual files are stored on your server
- URLs can be used to display images/videos or download documents

## Components

### FileUpload Component
Located at: `src/components/VendorRegister/FileUpload.jsx`

**Features:**
- Drag and drop file selection
- Multiple file support
- File type validation
- Upload progress indication
- File preview with icons
- Error handling
- File removal capability

**Props:**
- `label`: Display label for the upload section
- `description`: Help text explaining what to upload
- `onFileSelect`: Callback function receiving uploaded URLs
- `required`: Whether files are mandatory

### Usage Examples

#### Basic File Upload
```jsx
<FileUpload
  label="Profile Picture"
  description="Upload your profile photo"
  onFileSelect={(urls) => setProfileImage(urls?.[0])}
  required={true}
/>
```

#### Document Upload
```jsx
<FileUpload
  label="Business Documents"
  description="Upload business registration documents"
  onFileSelect={(urls) => setDocuments(urls)}
  required={false}
/>
```

## Backend Integration

### Upload Endpoint
The backend provides an `/api/upload` endpoint that:
- Accepts multipart form data
- Uploads files to Cloudinary
- Returns secure URLs and public IDs
- Handles errors gracefully

### Database Schema
The vendor registration model includes fields for storing file URLs:

```javascript
{
  images: [String],        // Array of image URLs
  videos: [String],        // Array of video URLs
  documents: {
    gst: [String],         // Array of GST document URLs
    businessProof: [String], // Array of business proof URLs
    idProof: [String]      // Array of ID proof URLs
  }
}
```

## File Upload Flow

```
User selects files → Files uploaded to Cloudinary → URLs received → URLs stored in state → Form submitted with URLs → Backend stores URLs in database
```

## Security Features

- **No File Type Restrictions**: Any file type can be uploaded
- **Direct Upload**: Files go directly to Cloudinary, not through your server
- **Secure URLs**: Cloudinary provides HTTPS URLs for all files
- **Folder Organization**: Files are organized in specific folders on Cloudinary
- **No Server Storage**: Your server never stores actual files

## Testing

Visit `/test-upload` route to test the file upload functionality:
- Upload different types of files
- See how URLs are captured
- Test the complete flow
- Check console for data structure

## Environment Setup

### Backend (.env file)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend
No environment variables needed - the frontend communicates with your backend upload endpoint.

## Error Handling

The system handles various error scenarios:
- **Upload Failures**: Network errors, Cloudinary issues
- **Invalid File Types**: Files that don't match accepted types
- **File Size Issues**: Large files that exceed limits
- **Network Problems**: Connection issues during upload

## Best Practices

1. **File Size Limits**: Consider implementing file size restrictions
2. **File Type Restrictions**: Only accept necessary file types
3. **User Feedback**: Show upload progress and success/error messages
4. **Validation**: Validate files on both frontend and backend
5. **Cleanup**: Implement cleanup for failed uploads

## Troubleshooting

### Common Issues

1. **Upload Fails**: Check Cloudinary credentials and network connection
2. **Files Not Showing**: Verify the `onFileSelect` callback is working
3. **URLs Not Stored**: Check if the form submission includes file URLs
4. **CORS Errors**: Ensure backend CORS is properly configured

### Debug Steps

1. Check browser console for errors
2. Verify Cloudinary credentials in backend
3. Test upload endpoint directly
4. Check network tab for failed requests
5. Verify file type restrictions

## Future Enhancements

- **Image Compression**: Automatically compress large images
- **Thumbnail Generation**: Create thumbnails for images
- **File Preview**: Show file previews before upload
- **Batch Operations**: Handle multiple file operations
- **Progress Tracking**: Show detailed upload progress
- **Resume Upload**: Resume interrupted uploads
