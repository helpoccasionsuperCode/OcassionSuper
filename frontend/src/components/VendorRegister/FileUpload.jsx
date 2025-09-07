// import { useState, useRef } from "react";
// import { toast } from "react-toastify";

// const FileUpload = ({ label, description, onFileSelect, initialFiles = [], initialUrls = [], required = false }) => {
//   const fileInputRef = useRef(null);
//   const [files, setFiles] = useState(initialFiles);
//   const [uploadedUrls, setUploadedUrls] = useState(initialUrls);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState("");



//   const handleFileChange = async (e) => {
    
//     const selectedFiles = Array.from(e.target.files);

//     if (selectedFiles.length === 0) {
//       if (onFileSelect) {
//         onFileSelect(null);
//       }
//       return;
//     }

//     const isVideoUpload = label.toLowerCase().includes('video');
//     const maxCount = isVideoUpload ? 2 : 5;
//     const maxSize = isVideoUpload ? 50 * 1024 * 1024 : 100 * 1024 * 1024; // 50MB for videos, 100MB for images

//     const allFilesPreview = [...files, ...selectedFiles];
//     if (allFilesPreview.length > maxCount) {
//       toast.error(`You can upload a maximum of ${maxCount} ${isVideoUpload ? 'videos' : 'images'}`);
//       return;
//     }

//     // check size limit
//     const oversized = selectedFiles.filter(f => f.size > maxSize);
//     if (oversized.length > 0) {
//       setError(
//         `File(s) exceed ${isVideoUpload ? '50' : '100'} MB limit: ${oversized
//           .map(f => f.name)
//           .join(', ')}`
//       );
//       toast.error(`File(s) exceed ${isVideoUpload ? '50' : '100'} MB limit`);
//       return;
//     }

   
//     const allFiles = [...files, ...selectedFiles];
//     setFiles(allFiles);
//     setError("");

//     // upload new ones only
//     if (onFileSelect) {
//       await uploadFilesToCloudinary(selectedFiles, allFiles);
//     }
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }

//   };

  
//   const uploadFilesToCloudinary = async (filesToUpload, allFiles) => {
//     setUploading(true);
//     const urls = [...uploadedUrls]; // keep already uploaded URLs


//     try {
//       for (let file of filesToUpload) {
//         const fd = new FormData();
//         fd.append("file", file);

//         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || "https://ocassionsuper.onrender.com"}/api/upload`, {
//           method: "POST",
//           body: fd,
//         });

//         if (!res.ok) {
//           throw new Error(`Upload failed: ${res.statusText}`);
//         }

//         const data = await res.json();
//         urls.push(data.url);
//       }

//       setUploadedUrls(urls);
//       if (onFileSelect) {
//         onFileSelect(urls, allFiles); // pass urls + files to parent
//       }
//       toast.success("Files uploaded successfully");
//     } catch (error) {
//       console.error("Upload error:", error);
//       const message = error?.message || "Upload failed";
//       setError(message);
//       toast.error(message);
//       if (onFileSelect) {
//         onFileSelect(null);
//       }
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleRemoveFile = (indexToRemove) => {
//     const updatedFiles = files.filter((_, index) => index !== indexToRemove);
//     const updatedUrls = uploadedUrls.filter((_, index) => index !== indexToRemove);

//     setFiles(updatedFiles);
//     setUploadedUrls(updatedUrls);

//     if (onFileSelect) {
//       onFileSelect(updatedUrls.length > 0 ? updatedUrls : null, updatedFiles);
//     }
//   };

//   const getFileIcon = (fileName) => {
//     const ext = fileName.split('.').pop()?.toLowerCase();
//     if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '\ud83d\uddbc️';
//     if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) return '🎥';
//     if (['pdf', 'doc', 'docx'].includes(ext)) return '\ud83d\udcc4';
//     return '\ud83d\udcc1';
//   };

//   return (
//     <div className="outline-2 outline-[#E69B83] border-gray-300 rounded-lg p-3 mb-6 bg-white">
//       <div className="flex items-center gap-3 mb-2">
//         {/* <span className="text-2xl">\ud83d\udcc4</span> */}
//         <div>
//           <h3 className="font-semibold text-lg">{label}</h3>
//           <p className="text-gray-500 text-sm">{description}</p>
//           {!required && <p className="text-blue-500 text-xs">(Optional)</p>}
//         </div>
//       </div>

//       <label className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
//         {uploading ? (
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E69B83] mx-auto mb-2"></div>
//             <span className="text-gray-500">Uploading...</span>
//           </div>
//         ) : (
//           <>
//             <span className="text-gray-400 mb-2">⬆️ Drag and drop your files here</span>
//             <span className="px-4 py-2 bg-[#E69B83] text-white rounded-md hover:bg-[#c16a4d] transition">
//               Choose Files
//             </span>
//           </>
//         )}
//         <input
//           type="file"
//           ref={fileInputRef}
//           className="hidden"
//           multiple
//           onChange={handleFileChange}
//           disabled={uploading}
//         />
//       </label>

//       {files.length > 0 && (
//         <div className="mt-3">
//           <h4 className="font-medium text-sm text-gray-700 mb-2">Selected Files:</h4>
//           <ul className="space-y-2">
//             {files.map((file, idx) => (
//               <li key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
//                 <div className="flex items-center gap-2">
//                   <span className="text-lg">{getFileIcon(file.name)}</span>
//                   <span className="text-sm text-gray-700">{file.name}</span>
//                   <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
//                 </div>
//                 <button
//                   onClick={() => handleRemoveFile(idx)}
//                   className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
//                   disabled={uploading}
//                 >
//                   Remove
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}


//       {error && (
//         <p className="text-red-500 text-sm mt-2">{error}</p>
//       )}

//       {required && files.length === 0 && !uploading && (
//         <p className="text-red-500 text-sm mt-2">At least one file is required.</p>
//       )}
//     </div>
//   );
// };

// export default FileUpload;


import { useState, useRef } from "react";
import { toast } from "react-toastify";

const FileUpload = ({
  label,
  description,
  onFileSelect,
  initialFiles = [],
  initialUrls = [],
  required = false,
}) => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState(initialFiles);
  const [uploadedUrls, setUploadedUrls] = useState(initialUrls);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) {
      if (onFileSelect) onFileSelect(null);
      return;
    }

    const isVideoUpload = label.toLowerCase().includes("video");
    const maxCount = isVideoUpload ? 2 : 5;
    const maxSize = isVideoUpload ? 50 * 1024 * 1024 : 100 * 1024 * 1024;

    const allFilesPreview = [...files, ...selectedFiles];
    if (allFilesPreview.length > maxCount) {
      toast.error(
        `You can upload a maximum of ${maxCount} ${
          isVideoUpload ? "videos" : "images"
        }`
      );
      return;
    }

    // size limit
    const oversized = selectedFiles.filter((f) => f.size > maxSize);
    if (oversized.length > 0) {
      setError(
        `File(s) exceed ${isVideoUpload ? "50" : "100"} MB limit: ${oversized
          .map((f) => f.name)
          .join(", ")}`
      );
      toast.error(`File(s) exceed ${isVideoUpload ? "50" : "100"} MB limit`);
      return;
    }

    const allFiles = [...files, ...selectedFiles];
    setFiles(allFiles);
    setError("");

    if (onFileSelect) {
      await uploadFilesToCloudinary(selectedFiles, allFiles);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFilesToCloudinary = async (filesToUpload, allFiles) => {
    setUploading(true);
    const urls = [...uploadedUrls];

    try {
      for (let file of filesToUpload) {
        const fd = new FormData();
        fd.append("file", file);

        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL ||
            "https://ocassionsuper.onrender.com"
          }/api/upload`,
          {
            method: "POST",
            body: fd,
          }
        );

        if (!res.ok) {
          throw new Error(`Upload failed: ${res.statusText}`);
        }

        const data = await res.json();
        urls.push(data.url);
      }

      setUploadedUrls(urls);
      if (onFileSelect) {
        onFileSelect(urls, allFiles);
      }
      toast.success("Files uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      const message = error?.message || "Upload failed";
      setError(message);
      toast.error(message);
      if (onFileSelect) onFileSelect(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    const updatedUrls = uploadedUrls.filter((_, index) => index !== indexToRemove);

    setFiles(updatedFiles);
    setUploadedUrls(updatedUrls);

    if (onFileSelect) {
      onFileSelect(updatedUrls.length > 0 ? updatedUrls : null, updatedFiles);
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "🖼️";
    if (["mp4", "avi", "mov", "wmv"].includes(ext)) return "🎥";
    if (["pdf", "doc", "docx"].includes(ext)) return "📄";
    return "📁";
  };

  return (
    <div className="outline-2 outline-[#E69B83] border border-gray-200 rounded-lg p-3 mb-6 bg-white w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{label}</h3>
          <p className="text-gray-500 text-sm">{description}</p>
          {!required && <p className="text-blue-500 text-xs">(Optional)</p>}
        </div>
      </div>

      <label
        className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition w-full text-center ${
          uploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {uploading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E69B83] mx-auto mb-2"></div>
            <span className="text-gray-500 text-sm">Uploading...</span>
          </div>
        ) : (
          <>
            <span className="text-gray-400 text-sm sm:text-base mb-2">
              ⬆️ Drag and drop your files here
            </span>
            <span className="px-3 py-2 sm:px-4 sm:py-2 bg-[#E69B83] text-white rounded-md hover:bg-[#c16a4d] text-sm sm:text-base transition">
              Choose Files
            </span>
          </>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>

      {files.length > 0 && (
        <div className="mt-3">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Selected Files:</h4>
          <ul className="space-y-2">
            {files.map((file, idx) => (
              <li
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-gray-50 rounded-lg text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getFileIcon(file.name)}</span>
                  <span className="text-gray-700 break-all">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveFile(idx)}
                  className="text-red-500 hover:text-red-700 text-xs px-2 py-1 mt-2 sm:mt-0 rounded hover:bg-red-50"
                  disabled={uploading}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {required && files.length === 0 && !uploading && (
        <p className="text-red-500 text-sm mt-2">At least one file is required.</p>
      )}
    </div>
  );
};

export default FileUpload;
