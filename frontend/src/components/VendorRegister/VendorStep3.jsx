// import FileUpload from "./FileUpload";
// import { CircleCheck, Shield } from "lucide-react";

// const VendorStep3 = ({ formData, setFormData }) => {

//   return (
//     <div className="max-w-3xl mx-auto">
//       <h2 className="text-2xl text-center font-bold">Document Upload</h2>
//       <p className="text-center text-gray-600 mb-4">
//         Upload required documents for verification (all documents are optional)
//       </p>

//       {/* GST Upload */}
//       <FileUpload
//         label="GST Certificate"
//         description="Required for tax compliance"
//         onFileSelect={(urls) => setFormData((prev) => ({
//           ...prev,
//           documents: { ...prev.documents, gst: urls },
//         }))}
//         required={false}
//       />

//       <FileUpload
//         label="Business Registration"
//         description="Shop license or business registration"
//         onFileSelect={(urls) => setFormData((prev) => ({
//           ...prev,
//           documents: { ...prev.documents, businessProof: urls },
//         }))}
//         required={false}
//       />

//       {/* ID Proof Upload */}
//       <FileUpload
//         label="ID Proof"
//         description="Aadhaar, PAN, or Passport"
//         onFileSelect={(urls) => setFormData((prev) => ({
//           ...prev,
//           documents: { ...prev.documents, idProof: urls },
//         }))}
//         required={false}
//       />

//       {/* Security Note */}
//       <div className="p-4 bg-blue-50 rounded-lg mt-6">
//         <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
//           <Shield className="w-6 h-6 text-orange-500" />
//           Document Security
//         </h3>
//         <ul className="text-gray-600 list-disc space-y-1">
//           <li className="flex items-center gap-2">
//             <CircleCheck className="w-4 h-4 text-green-500" />
//             All documents are encrypted and stored securely
//           </li>
//           <li className="flex items-center gap-2">
//             <CircleCheck className="w-4 h-4 text-green-500" />
//             Used only for verification purposes
//           </li>
//           <li className="flex items-center gap-2">
//             <CircleCheck className="w-4 h-4 text-green-500" />
//             Deleted after verification is complete
//           </li>
//           <li className="flex items-center gap-2">
//             <CircleCheck className="w-4 h-4 text-green-500" />
//             Documents are optional - you can upload them later
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default VendorStep3;


import FileUpload from "./FileUpload";
import { useState } from "react";
import { CircleCheck, Shield } from "lucide-react";

const VendorStep3 = ({ formData, setFormData }) => {
  // const [stepFiles, setStepFiles] = useState([]);
  // const [stepUrls, setStepUrls] = useState([]);

  const [gstFiles, setGstFiles] = useState([]);
  const [gstUrls, setGstUrls] = useState([]);

  const [businessFiles, setBusinessFiles] = useState([]);
  const [businessUrls, setBusinessUrls] = useState([]);

  const [idFiles, setIdFiles] = useState([]);
  const [idUrls, setIdUrls] = useState([]);


  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl text-center font-bold">Document Upload</h2>
      <p className="text-center text-gray-600 mb-4">
        Upload required documents for verification (all documents are optional)
      </p>

      {/* GST Upload */}
      <FileUpload
        label="GST Certificate"
        description="Required for tax compliance"
        // onFileSelect={(urls) => setFormData((prev) => ({
        //   ...prev,
        //   documents: { ...prev.documents, gst: urls },
        // }))}
        // required={false}
        // initialFiles={stepFiles}      // <-- persist files
        // initialUrls={stepUrls}
        onFileSelect={(urls, files) => {
          setGstFiles(files);
          setGstUrls(urls);
          setFormData((prev) => ({
            ...prev,
            documents: { ...prev.documents, gst: urls },
          }));
        }}
        required={false}
        initialFiles={gstFiles}
        initialUrls={gstUrls}
      />

      <FileUpload
        label="Business Registration"
        description="Shop license or business registration"
        // onFileSelect={(urls) => setFormData((prev) => ({
        //   ...prev,
        //   documents: { ...prev.documents, businessProof: urls },
        // }))}
        // required={false}
        // initialFiles={stepFiles}      // <-- persist files
        // initialUrls={stepUrls}
        onFileSelect={(urls, files) => {
          setBusinessFiles(files);
          setBusinessUrls(urls);
          setFormData((prev) => ({
            ...prev,
            documents: { ...prev.documents, businessProof: urls },
          }));
        }}
        initialFiles={businessFiles}
        initialUrls={businessUrls}
        required={false}
      />

      {/* ID Proof Upload */}
      <FileUpload
        label="ID Proof"
        description="Aadhaar, PAN, or Passport"
        // onFileSelect={(urls) => setFormData((prev) => ({
        //   ...prev,
        //   documents: { ...prev.documents, idProof: urls },
        // }))}
        // required={false}
        // initialFiles={stepFiles}      // <-- persist files
        // initialUrls={stepUrls}
        onFileSelect={(urls, files) => {
          setIdFiles(files);
          setIdUrls(urls);
          setFormData((prev) => ({
            ...prev,
            documents: { ...prev.documents, idProof: urls },
          }));
        }}
        initialFiles={idFiles}
        initialUrls={idUrls}
        required={false}
      />


      {/* Security Note */}
      <div className="p-4 bg-blue-50 rounded-lg mt-6">
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <Shield className="w-6 h-6 text-orange-500" />
          Document Security
        </h3>
        <ul className="text-gray-600 list-disc space-y-1">
          <li className="flex items-center gap-2">
            <CircleCheck className="w-4 h-4 text-green-500" />
            All documents are encrypted and stored securely
          </li>
          <li className="flex items-center gap-2">
            <CircleCheck className="w-4 h-4 text-green-500" />
            Used only for verification purposes
          </li>
          <li className="flex items-center gap-2">
            <CircleCheck className="w-4 h-4 text-green-500" />
            Deleted after verification is complete
          </li>
          <li className="flex items-center gap-2">
            <CircleCheck className="w-4 h-4 text-green-500" />
            Documents are optional - you can upload them later
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VendorStep3;
