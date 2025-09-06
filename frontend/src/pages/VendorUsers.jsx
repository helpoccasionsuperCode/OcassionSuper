// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { generateStrongPassword } from "../utils/passwordGenerator";
// import { toast } from "react-toastify";

// function VendorUsers() {
//   const { vendorId } = useParams();
//   const navigate = useNavigate();
//   const [vendor, setVendor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [creating, setCreating] = useState(false);
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     phone_number: ""
//   });

//   useEffect(() => {
//     const fetchVendor = async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || "https://ocassionsupernew-1.onrender.com"}/api/admin/vendors`, {
//           credentials: "include",
//         });
//         if (!res.ok) {
//           const body = await res.json().catch(() => ({}));
//           throw new Error(body.message || `Request failed with ${res.status}`);
//         }
//         const data = await res.json();
//         const vendorData = data.data.find(v => v._id === vendorId);
//         if (!vendorData) {
//           throw new Error("Vendor not found");
//         }
//         setVendor(vendorData);
//         setFormData(prev => ({
//           ...prev,
//           email: vendorData.email || "",
//           phone_number: vendorData.phone || ""
//         }));
//       } catch (err) {
//         setError(err.message || "Failed to load vendor");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (vendorId) {
//       fetchVendor();
//     }
//   }, [vendorId]);

//   const handleGeneratePassword = () => {
//     const newPassword = generateStrongPassword();
//     setFormData(prev => ({ ...prev, password: newPassword }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.email || !formData.password) {
//       toast.error("Email and password are required");
//       return;
//     }

//     try {
//       setCreating(true);
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || "https://ocassionsupernew-1.onrender.com"}/api/admin/users/create-vendor`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//           vendor_id: vendorId,
//           phone_number: formData.phone_number || undefined
//         })
//       });

//       const data = await res.json();
      
//       if (!res.ok) {
//         throw new Error(data.message || `Request failed with ${res.status}`);
//       }

//       toast.success("Vendor user created successfully!");
//       navigate("/admin");
//     } catch (err) {
//       toast.error(err.message || "Failed to create vendor user");
//     } finally {
//       setCreating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ padding: "16px", maxWidth: 800, margin: "0 auto" }}>
//         <p>Loading vendor information...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ padding: "16px", maxWidth: 800, margin: "0 auto" }}>
//         <div style={{ color: "#b00020", marginBottom: 12 }}>Error: {error}</div>
//         <button 
//           onClick={() => navigate("/admin")} 
//           style={{ 
//             padding: "8px 16px", 
//             borderRadius: 6, 
//             border: "1px solid #6b7280", 
//             background: "#6b7280", 
//             color: "#fff", 
//             cursor: "pointer" 
//           }}
//         >
//           Back to Admin
//         </button>
//       </div>
//     );
//   }

//   if (!vendor) {
//     return (
//       <div style={{ padding: "16px", maxWidth: 800, margin: "0 auto" }}>
//         <p>Vendor not found</p>
//         <button 
//           onClick={() => navigate("/admin")} 
//           style={{ 
//             padding: "8px 16px", 
//             borderRadius: 6, 
//             border: "1px solid #6b7280", 
//             background: "#6b7280", 
//             color: "#fff", 
//             cursor: "pointer" 
//           }}
//         >
//           Back to Admin
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: "16px", maxWidth: 800, margin: "0 auto" }}>
//       <div style={{ marginBottom: 24 }}>
//         <button 
//           onClick={() => navigate("/admin")} 
//           style={{ 
//             padding: "8px 16px", 
//             borderRadius: 6, 
//             border: "1px solid #6b7280", 
//             background: "#6b7280", 
//             color: "#fff", 
//             cursor: "pointer",
//             marginBottom: 16
//           }}
//         >
//           ← Back to Admin
//         </button>
//         <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
//           Create Vendor User
//         </h1>
//         <p style={{ color: "#6b7280", marginBottom: 16 }}>
//           Create a user account for: <strong>{vendor.businessName}</strong>
//         </p>
//       </div>

//       {/* Vendor Information */}
//       <div style={{ 
//         border: "1px solid #e5e7eb", 
//         borderRadius: 8, 
//         padding: 16, 
//         background: "#f9fafb", 
//         marginBottom: 24 
//       }}>
//         <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Vendor Information</h3>
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 14 }}>
//           <div><strong>Business Name:</strong> {vendor.businessName}</div>
//           <div><strong>Owner:</strong> {vendor.ownerName}</div>
//           <div><strong>Email:</strong> {vendor.email}</div>
//           <div><strong>Phone:</strong> {vendor.phone}</div>
//           <div><strong>City:</strong> {vendor.city}</div>
//           <div><strong>Service Area:</strong> {vendor.serviceArea}</div>
//           <div><strong>Categories:</strong> {(vendor.categories || []).join(", ")}</div>
//           <div><strong>Status:</strong> 
//             <span style={{ 
//               padding: "2px 8px", 
//               borderRadius: 9999, 
//               background: "#dcfce7", 
//               color: "#166534",
//               marginLeft: 8
//             }}>
//               {vendor.status}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Create User Form */}
//       <form onSubmit={handleSubmit} style={{ 
//         border: "1px solid #e5e7eb", 
//         borderRadius: 8, 
//         padding: 24, 
//         background: "#fff" 
//       }}>
//         <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>User Account Details</h3>
        
//         <div style={{ marginBottom: 20 }}>
//           <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
//             Email Address *
//           </label>
//           <input
//             type="email"
//             name="email"
//             readOnly
//             value={formData.email}
//             onChange={handleInputChange}
//             required
//             style={{
//               width: "100%",
//               padding: "12px",
//               border: "1px solid #d1d5db",
//               borderRadius: 6,
//               fontSize: 14,
//               boxSizing: "border-box",
//               cursor:"disabled"
//             }}
//             placeholder="Enter email address"
//           />
//         </div>

//         <div style={{ marginBottom: 20 }}>
//           <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
//             Password *
//           </label>
//           <div style={{ display: "flex", gap: 8 }}>
//             <input
//               type="text"
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               required
//               style={{
//                 flex: 1,
//                 padding: "12px",
//                 border: "1px solid #d1d5db",
//                 borderRadius: 6,
//                 fontSize: 14,
//                 fontFamily: "monospace"
//               }}
//               placeholder="Click 'Generate Password' to create a strong password"
//             />
//             <button
//               type="button"
//               onClick={handleGeneratePassword}
//               style={{
//                 padding: "12px 16px",
//                 border: "1px solid #3b82f6",
//                 borderRadius: 6,
//                 background: "#3b82f6",
//                 color: "#fff",
//                 cursor: "pointer",
//                 fontSize: 14,
//                 whiteSpace: "nowrap"
//               }}
//             >
//               Generate Password
//             </button>
//           </div>
//           <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
//             A strong password will be automatically generated with uppercase, lowercase, numbers, and special characters.
//           </p>
//         </div>

//         <div style={{ marginBottom: 24 }}>
//           <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
//             Phone Number
//           </label>
//           <input
//             type="tel"
//             name="phone_number"
//             value={formData.phone_number}
//             onChange={handleInputChange}
//             style={{
//               width: "100%",
//               padding: "12px",
//               border: "1px solid #d1d5db",
//               borderRadius: 6,
//               fontSize: 14,
//               boxSizing: "border-box"
//             }}
//             placeholder="Enter phone number (optional)"
//           />
//         </div>

//         <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
//           <button
//             type="button"
//             onClick={() => navigate("/admin")}
//             style={{
//               padding: "12px 24px",
//               border: "1px solid #6b7280",
//               borderRadius: 6,
//               background: "#fff",
//               color: "#6b7280",
//               cursor: "pointer",
//               fontSize: 14
//             }}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={creating}
//             style={{
//               padding: "12px 24px",
//               border: "1px solid #10b981",
//               borderRadius: 6,
//               background: creating ? "#6b7280" : "#10b981",
//               color: "#fff",
//               cursor: creating ? "not-allowed" : "pointer",
//               fontSize: 14
//             }}
//           >
//             {creating ? "Creating..." : "Create User"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default VendorUsers;


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { generateStrongPassword } from "../utils/passwordGenerator";
import { toast } from "react-toastify";
import VendorEmailNotification from "../components/VendorEmailNotification";

function VendorUsers() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [userCreated, setUserCreated] = useState(false);
  const [createdUserData, setCreatedUserData] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone_number: "",
  });

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL || "https://ocassionsupernew-1.onrender.com"
          }/api/admin/vendors`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || `Request failed with ${res.status}`);
        }
        const data = await res.json();
        const vendorData = data.data.find((v) => v._id === vendorId);
        if (!vendorData) {
          throw new Error("Vendor not found");
        }
        setVendor(vendorData);
        setFormData((prev) => ({
          ...prev,
          email: vendorData.email || "",
          phone_number: vendorData.phone || "",
        }));
      } catch (err) {
        setError(err.message || "Failed to load vendor");
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);

  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword();
    setFormData((prev) => ({ ...prev, password: newPassword }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setCreating(true);
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL || "https://ocassionsupernew-1.onrender.com"
        }/api/admin/users/create-vendor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            vendor_id: vendorId,
            phone_number: formData.phone_number || undefined,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Request failed with ${res.status}`);
      }

      // Store created user data for email sending
      setCreatedUserData({
        ...vendor,
        password: formData.password
      });
      setUserCreated(true);
      toast.success("Vendor user created successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to create vendor user");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <p>Loading vendor information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <div className="text-red-600 mb-3">Error: {error}</div>
        <button
          onClick={() => navigate("/admin")}
          className="px-4 py-2 rounded-md border border-gray-500 bg-gray-500 text-white"
        >
          Back to Admin
        </button>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <p>Vendor not found</p>
        <button
          onClick={() => navigate("/admin")}
          className="px-4 py-2 rounded-md border border-gray-500 bg-gray-500 text-white"
        >
          Back to Admin
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin")}
          className="px-4 py-2 rounded-md border border-gray-500 bg-gray-500 text-white mb-4"
        >
          ← Back to Admin
        </button>
        <h1 className="text-2xl font-bold mb-2">Create Vendor User</h1>
        <p className="text-gray-600">
          Create a user account for: <strong>{vendor.businessName}</strong>
        </p>
      </div>

      {/* Vendor Information */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-6">
        <h3 className="text-lg font-semibold mb-3">Vendor Information</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <strong>Business Name:</strong> {vendor.businessName}
          </div>
          <div>
            <strong>Owner:</strong> {vendor.ownerName}
          </div>
          <div>
            <strong>Email:</strong> {vendor.email}
          </div>
          <div>
            <strong>Phone:</strong> {vendor.phone}
          </div>
          <div>
            <strong>City:</strong> {vendor.city}
          </div>
          <div>
            <strong>Service Area:</strong> {vendor.serviceArea}
          </div>
          <div>
            <strong>Categories:</strong>{" "}
            {(vendor.categories || []).join(", ")}
          </div>
          <div>
            <strong>Status:</strong>
            <span className="ml-2 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
              {vendor.status}
            </span>
          </div>
        </div>
      </div>

      {/* Create User Form */}
      <form
        onSubmit={handleSubmit}
        className="border border-gray-200 rounded-lg p-6 bg-white"
      >
        <h3 className="text-lg font-semibold mb-5">User Account Details</h3>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Email Address *</label>
          <input
            type="email"
            name="email"
            readOnly
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-100 cursor-not-allowed"
            placeholder="Enter email address"
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Password *</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="flex-1 p-3 border border-gray-300 rounded-md text-sm font-mono"
              placeholder="Click 'Generate Password' to create a strong password"
            />
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="px-4 py-3 border border-blue-500 rounded-md bg-blue-500 text-white text-sm whitespace-nowrap"
            >
              Generate Password
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            A strong password will be automatically generated with uppercase,
            lowercase, numbers, and special characters.
          </p>
        </div>

        {/* Phone Number */}
        {/* <div className="mb-6">
          <label className="block mb-2 font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            readOnly
            value={formData.phone_number}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md text-sm bg-gray-100 cursor-not-allowed"
            placeholder="Enter phone number (optional)"
          />
        </div> */}

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="px-6 py-3 border border-gray-500 rounded-md bg-white text-gray-600 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={creating}
            className={`px-6 py-3 border rounded-md text-white text-sm ${
              creating
                ? "bg-gray-500 border-gray-500 cursor-not-allowed"
                : "bg-emerald-500 border-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {creating ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>

      {/* Email Notification Section - Show after user creation */}
      {/* {userCreated && createdUserData && (
        <div className="mt-6">
          <VendorEmailNotification
            vendorData={createdUserData}
            password={createdUserData.password}
            onEmailSent={() => {
              toast.success("Email sent successfully! You can now go back to admin.");
            }}
            onEmailFailed={() => {
              toast.error("Failed to send email, but user was created successfully.");
            }}
            showTestEmail={true}
          />
          
          <div className="mt-4 flex gap-3 justify-end">
            <button
              onClick={() => navigate("/admin")}
              className="px-6 py-3 border border-gray-500 rounded-md bg-white text-gray-600 text-sm hover:bg-gray-50"
            >
              Back to Admin
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default VendorUsers;
