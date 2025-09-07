// import React, { useState } from "react";
// import axios from "axios";
// import { Home } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import VendorStep1 from "./VendorStep1";
// import VendorStep2 from "./VendorStep2";
// import VendorStep3 from "./VendorStep3";
// import VendorStep4 from "./VendorStep4";
// import { toast } from "react-toastify";

// const Register = () => {
//     const navigate = useNavigate();
//     const [step, setStep] = useState(1);

//     const [formData, setFormData] = useState({
//         businessName: "",
//         ownerName: "",
//         email: "",
//         phone: "",
//         city: "",
//         serviceArea: "",
//         socialMedia: "",
//         categories: [],
//         othersCategories: [],
//         otherInput: "",
//         images: [],
//         videos: [],
//         packages: [],
//         documents: {
//             gst: null,
//             businessProof: null,
//             idProof: null,
//         },
//         bankDetails: {
//             accountHolder: "",
//             accountNumber: "",
//             ifsc: "",
//         },
//     });



//     const isStepValid = (currentStep) => {
//         if (currentStep === 1) {
//             // define hasOthers here
//             const hasOthers = formData.categories.includes("Others");

//             // Debug logging
//             console.log("=== VALIDATION DEBUG ===");
//             console.log("businessName:", formData.businessName, "✓", !!formData.businessName);
//             console.log("ownerName:", formData.ownerName, "✓", !!formData.ownerName);
//             console.log("email:", formData.email, "✓", !!formData.email);
//             console.log("phone:", formData.phone, "✓", !!formData.phone);
//             console.log("city:", formData.city, "✓", !!formData.city);
//             console.log("serviceArea:", formData.serviceArea, "✓", !!formData.serviceArea);
//             console.log("categories:", formData.categories);
//             console.log("categories.length:", formData.categories.length, "✓", formData.categories.length > 0);
//             console.log("hasOthers:", hasOthers);
//             console.log("othersCategories:", formData.othersCategories);
//             console.log("otherInput:", formData.otherInput);

//             // Basic validation
//             const basicFieldsValid = (
//                 formData.businessName?.trim() &&
//                 formData.ownerName?.trim() &&
//                 formData.email?.trim() &&
//                 formData.phone?.trim() &&
//                 formData.city?.trim() &&
//                 formData.serviceArea?.trim() &&
//                 formData.categories.length > 0
//             );

//             // Others category validation
//             let othersValid = true;
//             if (hasOthers) {
//                 othersValid = (
//                     (formData.othersCategories && formData.othersCategories.length > 0) ||
//                     (formData.otherInput && formData.otherInput.trim().length > 0)
//                 );
//             }

//             const isValid = basicFieldsValid && othersValid;

//             console.log("basicFieldsValid:", basicFieldsValid);
//             console.log("othersValid:", othersValid);
//             console.log("isValid:", isValid);
//             console.log("========================");

//             return isValid;
//         }
//         if (currentStep === 2) return true;
//         if (currentStep === 3) return true;
//         if (currentStep === 4) return true;
//         return false;
//     };




//     const handleCategorySelect = (name) => {
//         setFormData((prev) => {
//             const alreadySelected = prev.categories.includes(name);
//             return {
//                 ...prev,
//                 categories: alreadySelected
//                     ? prev.categories.filter((cat) => cat !== name)
//                     : [...prev.categories, name],
//             };
//         });
//     };

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async () => {
//         // Validate Gmail email
//         if (!formData.email || !formData.email.endsWith('@gmail.com')) {
//             toast.error("Email must contain @gmail.com");
//             return;
//         }

//         // Validate 10-digit phone number
//         if (!formData.phone || !/^(\d){10}$/.test(String(formData.phone))) {
//             toast.error("Invalid mobile number. Please enter exactly 10 digits.");
//             return;
//         }

//         if (
//             !formData.businessName ||
//             !formData.ownerName ||
//             !formData.city ||
//             !formData.serviceArea ||
//             !formData.categories.length
//         ) {
//             toast.error("Please fill in all required fields");
//             return;
//         }

//         try {
//             const sanitizedPackages = Array.isArray(formData.packages)
//                 ? formData.packages
//                     .filter((pkg) => pkg && (pkg.title || pkg.price || pkg.description))
//                     .map((pkg) => ({
//                         title: (pkg.title || "").trim(),
//                         price: String(pkg.price ?? "").trim(),
//                         description: (pkg.description || "").trim(),
//                         inclusions: pkg.inclusions || "",
//                     }))
//                     .filter((pkg) => pkg.title && pkg.price && pkg.description)
//                 : [];

//             // add othersCategory if present
//             const categoriesWithOthers = (formData.categories || []).map((c) => String(c).trim());
//             const { otherInput, ...cleanFormData } = formData;
//             const payload = {
//                 ...cleanFormData,
//                 phone: String(formData.phone).replace(/\D/g, ""),
//                 // categories: (formData.categories || []).map((c) => String(c).trim()),
//                 categories: categoriesWithOthers,
//                 othersCategories: (formData.othersCategories || []).map(v => v.trim()),
//                 packages: sanitizedPackages,
//                 images: formData.images || null,
//                 videos: formData.videos || null,
//                 documents: formData.documents || {
//                     gst: null,
//                     businessProof: null,
//                     idProof: null
//                 },
//                 socialMedia: formData.socialMedia || null,
//             };

//             localStorage.setItem("vendorFormData", JSON.stringify(payload));
//             console.log("Payload sent to backend:", payload);

//             // const response = await axios.post(
//             //     `${import.meta.env.VITE_BACKEND_URL || "https://ocassionsuper.onrender.com"}/api/register/vendor/register`,
//             //     payload,
//             //     { headers: { "Content-Type": "application/json" } }
//             // );

//             const formDataObj = new FormData();
//             Object.keys(payload).forEach(key => {
//                 if (key === "images" || key === "videos") {
//                     (payload[key] || []).forEach(file => formDataObj.append(key, file));
//                 } else if (key === "documents") {
//                     // append each doc file separately
//                     if (payload.documents.gst)
//                         [].concat(payload.documents.gst).forEach(f => formDataObj.append("gst", f));
//                     if (payload.documents.businessProof)
//                         [].concat(payload.documents.businessProof).forEach(f => formDataObj.append("businessProof", f));
//                     if (payload.documents.idProof)
//                         [].concat(payload.documents.idProof).forEach(f => formDataObj.append("idProof", f));
//                 } else if (key === "categories" || key === "packages") {
//                     formDataObj.append(key, JSON.stringify(payload[key]));
//                 }
//                 else if (key === "othersCategories") {
//                     formDataObj.append(key, JSON.stringify(payload[key]));
//                 }
//                 else if (key === "bankDetails") {
//                     // bankDetails is an object, must stringify for FormData
//                     formDataObj.append(key, JSON.stringify(payload[key]));
//                 }
//                 else {
//                     formDataObj.append(key, payload[key]);
//                 }
//             });

//             const response = await axios.post(
//                 `${import.meta.env.VITE_BACKEND_URL || "https://ocassionsuper.onrender.com"}/api/register/vendor/register`,
//                 formDataObj,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );


//             console.log("Vendor Registered:", response.data);
//             toast.success("Application Submitted Successfully");
//             navigate("/thank-you");
//         } catch (error) {
//             console.error("Error submitting form:", error);
//             const serverMsg = error?.response?.data?.message;
//             const serverErrors = error?.response?.data?.errors;
//             if (serverErrors && Array.isArray(serverErrors)) {
//                 toast.error(`Validation failed: ${serverErrors.join(", ")}`);
//             } else if (serverMsg) {
//                 toast.error(serverMsg);
//             } else {
//                 toast.error("Failed to submit application");
//             }
//         }
//     };



//     return (
//         <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
//             <div className="flex justify-between items-center mb-4">
//                 <button
//                     onClick={() => navigate("/vendor-auth")}
//                     className="flex items-center px-3 py-1 bg-white outline hover:cursor-pointer hover:bg-gray-300 rounded-lg text-gray-700"
//                 >
//                     <Home className="w-6 h-6" /> {/* lucide home icon */}
//                 </button>
//                 <h2 className="text-3xl font-bold">Become a Vendor</h2>
//                 <p className="text-gray-500 font-semibold">Step {step} of 4</p>
//             </div>


//             {/* Progress Bar */}
//             <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
//                 <div
//                     className="bg-[#E69B83] h-2 rounded-full transition-all"
//                     style={{ width: `${(step / 4) * 100}%` }}
//                 ></div>
//             </div>

//             {/* Debug Button - Remove this after testing */}
//             {/* <div className="mb-4 p-2 bg-gray-100 rounded">
//                 <button
//                     onClick={() => {
//                         console.log("=== FORM STATE DEBUG ===");
//                         console.log("formData:", formData);
//                         console.log("isStepValid(1):", isStepValid(1));
//                         console.log("========================");
//                     }}
//                     className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
//                 >
//                     Debug Form State
//                 </button>
//             </div> */}

//             {step === 1 && (
//                 <VendorStep1
//                     formData={formData}
//                     handleChange={handleChange}
//                     handleCategorySelect={handleCategorySelect}
//                     setFormData={setFormData}
//                 />
//             )}

//             {step === 2 && (
//                 <VendorStep2
//                     formData={formData}
//                     setFormData={setFormData}
//                     onPrev={() => setStep(1)}
//                     onNext={() => setStep(3)}
//                 />
//             )}



//             {step === 3 && (
//                 <VendorStep3
//                     formData={formData}
//                     setFormData={setFormData}
//                     onPrev={() => setStep(2)}
//                 />
//             )}

//             {step === 4 && (
//                 <VendorStep4
//                     formData={formData}
//                     setFormData={setFormData}
//                     onPrev={() => setStep(3)}
//                 />
//             )}

//             {/* Navigation */}
//             <div className="flex justify-between mt-8">
//                 <button
//                     onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
//                     disabled={step === 1}
//                     className="px-6 py-2 rounded-lg text-white hover:bg-[#c16a4d] bg-[#E69B83] disabled:opacity-50"
//                 >
//                     ← Previous
//                 </button>

//                 {step < 4 ? (

//                     <button
//                         onClick={() => {
//                             // if (!isStepValid(step)) {
//                             //     // your same toast logic
//                             //     if (!formData.email || !formData.email.endsWith('@gmail.com')) {
//                             //         toast.error("Email must contain @gmail.com");
//                             //         return;
//                             //     }
//                             //     if (!formData.phone || !/^(\d){10}$/.test(String(formData.phone))) {
//                             //         toast.error("Invalid mobile number. Please enter exactly 10 digits.");
//                             //         return;
//                             //     }
//                             //     toast.error("Please fill in all required fields");
//                             //     return;
//                             // }
//                             // setStep((prev) => Math.min(prev + 1, 4));

//                             // ✅ remove the entire if (!isStepValid(step)) { ... } wrapper
//                             // ✅ just check email & phone directly

//                             if (!formData.email || !formData.email.endsWith('@gmail.com')) {
//                                 toast.error("Email must contain @gmail.com");
//                                 return;
//                             }
//                             if (!formData.phone || !/^(\d){10}$/.test(String(formData.phone))) {
//                                 toast.error("Invalid mobile number. Please enter exactly 10 digits.");
//                                 return;
//                             }

//                             // everything OK → go to next step
//                             setStep((prev) => Math.min(prev + 1, 4));

//                         }}
//                         disabled={!isStepValid(step)}     // 👈 add this line
//                         className="px-6 py-2 rounded-lg bg-[#E69B83] hover:bg-[#c16a4d] text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         Next →
//                     </button>



//                 ) : (
//                     <button
//                         onClick={handleSubmit}
//                         disabled={!isStepValid(step)}
//                         className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         Submit Application
//                     </button>
//                 )}

//             </div>
//         </div>
//     );
// };

// export default Register;


import React, { useState } from "react";
import axios from "axios";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VendorStep1 from "./VendorStep1";
import VendorStep2 from "./VendorStep2";
import VendorStep3 from "./VendorStep3";
import VendorStep4 from "./VendorStep4";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    city: "",
    serviceArea: "",
    socialMedia: "",
    categories: [],
    othersCategories: [],
    otherInput: "",
    images: [],
    videos: [],
    packages: [],
    documents: {
      gst: null,
      businessProof: null,
      idProof: null,
    },
    bankDetails: {
      accountHolder: "",
      accountNumber: "",
      ifsc: "",
    },
  });

  // File state management for persistence across steps
  const [fileStates, setFileStates] = useState({
    // Step 1 files
    imageFiles: [],
    imageUrls: [],
    videoFiles: [],
    videoUrls: [],
    // Step 3 files
    gstFiles: [],
    gstUrls: [],
    businessFiles: [],
    businessUrls: [],
    idFiles: [],
    idUrls: [],
  });

  const isStepValid = (currentStep) => {
    if (currentStep === 1) {
      const hasOthers = formData.categories.includes("Others");
      const basicFieldsValid =
        formData.businessName?.trim() &&
        formData.ownerName?.trim() &&
        formData.email?.trim() &&
        formData.phone?.trim() &&
        formData.city?.trim() &&
        formData.serviceArea?.trim() &&
        formData.categories.length > 0;

      let othersValid = true;
      if (hasOthers) {
        othersValid =
          (formData.othersCategories && formData.othersCategories.length > 0) ||
          (formData.otherInput && formData.otherInput.trim().length > 0);
      }
      return basicFieldsValid && othersValid;
    }
    if (currentStep === 2) return true;
    if (currentStep === 3) return true;
    if (currentStep === 4) return true;
    return false;
  };

  const handleCategorySelect = (name) => {
    setFormData((prev) => {
      const alreadySelected = prev.categories.includes(name);
      return {
        ...prev,
        categories: alreadySelected
          ? prev.categories.filter((cat) => cat !== name)
          : [...prev.categories, name],
      };
    });
  };

  // File state management functions
  const updateFileState = (stepType, fileType, files, urls) => {
    const filesKey = `${stepType}${fileType}Files`;
    const urlsKey = `${stepType}${fileType}Urls`;
    
    console.log("updateFileState called:", {
      stepType,
      fileType,
      filesKey,
      urlsKey,
      filesCount: files.length,
      urlsCount: urls.length
    });
    
    setFileStates(prev => {
      const newState = {
        ...prev,
        [filesKey]: files,
        [urlsKey]: urls,
      };
      console.log("New fileStates:", newState);
      return newState;
    });
  };

  const getFileState = (stepType, fileType) => {
    return {
      files: fileStates[`${stepType}${fileType}Files`] || [],
      urls: fileStates[`${stepType}${fileType}Urls`] || [],
    };
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.email.endsWith("@gmail.com")) {
      toast.error("Email must contain @gmail.com");
      return;
    }

    if (!formData.phone || !/^(\d){10}$/.test(String(formData.phone))) {
      toast.error("Invalid mobile number. Please enter exactly 10 digits.");
      return;
    }

    if (
      !formData.businessName ||
      !formData.ownerName ||
      !formData.city ||
      !formData.serviceArea ||
      !formData.categories.length
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const sanitizedPackages = Array.isArray(formData.packages)
        ? formData.packages
            .filter((pkg) => pkg && (pkg.title || pkg.price || pkg.description))
            .map((pkg) => ({
              title: (pkg.title || "").trim(),
              price: String(pkg.price ?? "").trim(),
              description: (pkg.description || "").trim(),
              inclusions: pkg.inclusions || "",
            }))
            .filter((pkg) => pkg.title && pkg.price && pkg.description)
        : [];

      const categoriesWithOthers = (formData.categories || []).map((c) =>
        String(c).trim()
      );
      const { otherInput, ...cleanFormData } = formData;
      const payload = {
        ...cleanFormData,
        phone: String(formData.phone).replace(/\D/g, ""),
        categories: categoriesWithOthers,
        othersCategories: (formData.othersCategories || []).map((v) => v.trim()),
        packages: sanitizedPackages,
        images: formData.images || null,
        videos: formData.videos || null,
        documents:
          formData.documents || {
            gst: null,
            businessProof: null,
            idProof: null,
          },
        socialMedia: formData.socialMedia || null,
      };

      localStorage.setItem("vendorFormData", JSON.stringify(payload));

      const formDataObj = new FormData();
      Object.keys(payload).forEach((key) => {
        if (key === "images" || key === "videos") {
          (payload[key] || []).forEach((file) =>
            formDataObj.append(key, file)
          );
        } else if (key === "documents") {
          if (payload.documents.gst)
            []
              .concat(payload.documents.gst)
              .forEach((f) => formDataObj.append("gst", f));
          if (payload.documents.businessProof)
            []
              .concat(payload.documents.businessProof)
              .forEach((f) => formDataObj.append("businessProof", f));
          if (payload.documents.idProof)
            []
              .concat(payload.documents.idProof)
              .forEach((f) => formDataObj.append("idProof", f));
        } else if (key === "categories" || key === "packages") {
          formDataObj.append(key, JSON.stringify(payload[key]));
        } else if (key === "othersCategories") {
          formDataObj.append(key, JSON.stringify(payload[key]));
        } else if (key === "bankDetails") {
          formDataObj.append(key, JSON.stringify(payload[key]));
        } else {
          formDataObj.append(key, payload[key]);
        }
      });

      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL ||
          "https://ocassionsuper.onrender.com"
        }/api/register/vendor/register`,
        formDataObj,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Application Submitted Successfully");
      navigate("/thank-you");
    } catch (error) {
      console.error("Error submitting form:", error);
      const serverMsg = error?.response?.data?.message;
      const serverErrors = error?.response?.data?.errors;
      if (serverErrors && Array.isArray(serverErrors)) {
        toast.error(`Validation failed: ${serverErrors.join(", ")}`);
      } else if (serverMsg) {
        toast.error(serverMsg);
      } else {
        toast.error("Failed to submit application");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white rounded-2xl shadow-md w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <button
          onClick={() => navigate("/vendor-auth")}
          className="flex items-center px-3 py-2 bg-white outline hover:bg-gray-200 rounded-lg text-gray-700 w-fit"
        >
          <Home className="w-6 h-6" />
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          Become a Vendor
        </h2>
        <p className="text-gray-500 font-semibold text-center sm:text-right">
          Step {step} of 4
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="bg-[#E69B83] h-2 rounded-full transition-all"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>

      {/* Steps */}
      {step === 1 && (
        <VendorStep1
          formData={formData}
          handleChange={handleChange}
          handleCategorySelect={handleCategorySelect}
          setFormData={setFormData}
          fileStates={fileStates}
          updateFileState={updateFileState}
        />
      )}
      {step === 2 && (
        <VendorStep2
          formData={formData}
          setFormData={setFormData}
          onPrev={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <VendorStep3
          formData={formData}
          setFormData={setFormData}
          onPrev={() => setStep(2)}
          fileStates={fileStates}
          updateFileState={updateFileState}
        />
      )}
      {step === 4 && (
        <VendorStep4
          formData={formData}
          setFormData={setFormData}
          onPrev={() => setStep(3)}
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between mt-8 gap-3">
        <button
          onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
          disabled={step === 1}
          className="px-6 py-2 rounded-lg text-white hover:bg-[#c16a4d] bg-[#E69B83] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        {step < 4 ? (
          <button
            onClick={() => {
              if (!formData.email || !formData.email.endsWith("@gmail.com")) {
                toast.error("Email must contain @gmail.com");
                return;
              }
              if (!formData.phone || !/^(\d){10}$/.test(String(formData.phone))) {
                toast.error("Invalid mobile number. Please enter exactly 10 digits.");
                return;
              }
              setStep((prev) => Math.min(prev + 1, 4));
            }}
            disabled={!isStepValid(step)}
            className="px-6 py-2 rounded-lg bg-[#E69B83] hover:bg-[#c16a4d] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isStepValid(step)}
            className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Application
          </button>
        )}
      </div>
    </div>
  );
};

export default Register;
