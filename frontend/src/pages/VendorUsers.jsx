import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { generateStrongPassword } from "../utils/passwordGenerator";
import { toast } from "react-toastify";

function VendorUsers() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone_number: "",
    businessName: "",
    ownerName: "",
    city: "",
    serviceArea: "",
    categories: "",
    othersCategories: "",
  });

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL || "https://ocassionsuper.onrender.com"
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

        // Pre-populate form with vendor data
        setFormData((prev) => ({
          ...prev,
          email: vendorData.email || "",
          phone_number: vendorData.phone || vendorData.phone_number || "",
          businessName: vendorData.businessName || "",
          ownerName: vendorData.ownerName || "",
          city: vendorData.city || "",
          serviceArea: vendorData.serviceArea || "",
          categories: (vendorData.categories || []).join(", "),
          othersCategories: (vendorData.othersCategories || []).join(", "),
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

    if (!formData.businessName || !formData.ownerName || !formData.city || !formData.serviceArea) {
      toast.error("Business Name, Owner Name, City, and Service Area are required");
      return;
    }

    try {
      setCreating(true);

      // Convert categories string to array
      const categoriesArray = formData.categories
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat);

      // Convert othersCategories string to array
      const othersCategoriesArray = formData.othersCategories
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat);

      const requestData = {
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number || undefined,
        vendor_id: vendorId,
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        city: formData.city,
        serviceArea: formData.serviceArea,
        categories: categoriesArray,
        othersCategories: othersCategoriesArray,
      };

      console.log("Sending request data:", requestData);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || "https://ocassionsuper.onrender.com"
        }/api/admin/users/create-vendor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Request failed with ${res.status}`);
      }

      console.log("Response data:", data);
      console.log("Vendor email from response:", data.data?.email);
      toast.success("Vendor user created successfully!");

      // Send email to vendor after successful user creation
      try {
        toast.info("Sending email to vendor...", { autoClose: 1500 });

        const emailResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL || "https://ocassionsuper.onrender.com"}/api/vendorEmail/send-mail`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email: data.data?.email,
              password: formData.password,
              businessName: formData.businessName,
              ownerName: formData.ownerName
            }),
          }
        );

        const emailData = await emailResponse.json();

        if (emailResponse.ok && emailData.success) {
          toast.success("Email sent successfully to vendor");
        } else {
          toast.error(`Email sending failed: ${emailData.message || "Unknown error"}`);
        }
      } catch (emailErr) {
        console.error("Email sending error:", emailErr);
        toast.error("Failed to send email to vendor");
      }

      navigate("/admin");
    } catch (err) {
      console.error("Submit error:", err);
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
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-2">Register New Vendor</h1>
        <p className="text-gray-600">
          Create a complete vendor account with all business details
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
        <h3 className="text-lg font-semibold mb-5">Vendor Registration Details</h3>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Email Address
            <span className="text-red-500"> *</span>
          </label>
          <input
            type="email"
            name="email"
            readOnly
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full cursor-not-allowed p-3 border border-gray-300 rounded-md text-sm"
            placeholder="Enter email address"
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Password
            <span className="text-red-500"> *</span>
          </label>
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
              className="px-4 py-3 border border-blue-500 rounded-md bg-blue-500 text-white text-sm whitespace-nowrap hover:bg-blue-600"
            >
              Generate Password
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            A strong password will be automatically generated with uppercase,
            lowercase, numbers, and special characters.
          </p>
        </div>


        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="px-6 py-3 border border-gray-500 rounded-md bg-white text-gray-600 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={creating}
            className={`px-6 py-3 border rounded-md text-white text-sm ${creating
              ? "bg-gray-500 border-gray-500 cursor-not-allowed"
              : "bg-emerald-500 border-emerald-500 hover:bg-emerald-600"
              }`}
          >
            {creating ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VendorUsers;