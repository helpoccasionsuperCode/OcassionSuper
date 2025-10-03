import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VendorUsersList from "./VendorUsersList";

function Admin() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorUsers, setVendorUsers] = useState([]);
  const [usersError, setUsersError] = useState("");
  const [vendorUserEmails, setVendorUserEmails] = useState(new Set());

  useEffect(() => {
    const controller = new AbortController();
   

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");
        const base =
          import.meta.env.VITE_BACKEND_URL || "https://ocassionsuper.onrender.com";
        const vendorsRes = await fetch(`${base}/api/admin/vendors`, {
          credentials: "include",
          signal: controller.signal,
        });
        if (!vendorsRes.ok) {
          const body = await vendorsRes.json().catch(() => ({}));
          throw new Error(body.message || `Vendors failed with ${vendorsRes.status}`);
        }
        const vendorsData = await vendorsRes.json();
        setVendors(Array.isArray(vendorsData?.data) ? vendorsData.data : []);

        // fetch vendor users
        try {
          setUsersError("");
          const usersRes = await fetch(`${base}/api/admin/users/vendors`, {
            credentials: "include",
            signal: controller.signal,
          });
          if (!usersRes.ok) {
            const body = await usersRes.json().catch(() => ({}));
            throw new Error(body.message || `Users failed with ${usersRes.status}`);
          }
          const usersData = await usersRes.json();
          setVendorUsers(Array.isArray(usersData?.data) ? usersData.data : []);

          // Create a set of vendor user emails for quick lookup
          const emailSet = new Set((Array.isArray(usersData?.data) ? usersData.data : []).map(u => String(u.email || "").toLowerCase().trim()));
          setVendorUserEmails(emailSet);
        } catch (ue) {
          if (ue.name !== "AbortError") setUsersError(ue.message || "Failed to load vendor users");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    return () => controller.abort();
  }, []);

  const normalizedQuery = String(vendorSearch || "").toLowerCase().trim();
  const filteredVendors = normalizedQuery
    ? vendors.filter((v) => {
      const owner = String(v.ownerName || "").toLowerCase();
      const email = String(v.email || "").toLowerCase();
      return owner.includes(normalizedQuery) || email.includes(normalizedQuery);
    })
    : vendors;

  const pending = filteredVendors.filter(
    (v) => (v.status || "").toLowerCase() === "pending"
  );
  const approved = filteredVendors.filter(
    (v) => (v.status || "").toLowerCase() === "approved"
  );
  const rejected = filteredVendors.filter(
    (v) => (v.status || "").toLowerCase() === "rejected"
  );

  // Separate approved vendors into those with and without user accounts
  const approvedWithUsers = approved.filter(v =>
    vendorUserEmails.has(String(v.email || "").toLowerCase().trim())
  );
  const approvedWithoutUsers = approved.filter(v =>
    !vendorUserEmails.has(String(v.email || "").toLowerCase().trim())
  );

  const renderVendorGrid = (vendorList, showUserStatus = false) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {vendorList.map((v) => {
        const hasUser = vendorUserEmails.has(String(v.email || "").toLowerCase().trim());
        return (
          <Link
            key={v._id}
            to={`/admin/vendors/${v._id}`}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200"
          >
            <h3 className="text-lg font-semibold mb-2">{v.businessName}</h3>
            <p className="text-gray-600 text-sm">Owner: {v.ownerName}</p>
            <p className="text-gray-600 text-sm">Email: {v.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <p
                className={`inline-block px-2 py-1 text-xs font-medium rounded ${v.status.toLowerCase() === "approved"
                    ? "bg-green-100 text-green-800"
                    : v.status.toLowerCase() === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
              >
                {v.status}
              </p>
              {showUserStatus && v.status.toLowerCase() === "approved" && (
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${hasUser
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800"
                  }`}>
                  {hasUser ? "👤 Has User" : "⚠️ No User"}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="mx-auto">

      {loading && <p>Loading vendors...</p>}
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}

      <input
        value={vendorSearch}
        onChange={(e) => setVendorSearch(e.target.value)}
        placeholder="Search by owner name or email"
        className="w-full  border border-gray-300 rounded-lg p-2 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Pending ({pending.length})</h2>
          {renderVendorGrid(pending)}
        </div>
      )}

      {/* Approved */}
      {approved.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Approved ({approved.length})</h2>

          {/* Approved without users */}
          {approvedWithoutUsers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-orange-700 mb-3">
                ⚠️ Approved - No User Account ({approvedWithoutUsers.length})
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                These vendors are approved but don't have user accounts yet. Click "Create User" to set up their login credentials.
              </p>
              {renderVendorGrid(approvedWithoutUsers, true)}
            </div>
          )}

          {/* Approved with users */}
          {approvedWithUsers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-blue-700 mb-3">
                👤 Approved - Has User Account ({approvedWithUsers.length})
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                These vendors are approved and have active user accounts.
              </p>
              {renderVendorGrid(approvedWithUsers, true)}
            </div>
          )}
        </div>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Rejected ({rejected.length})</h2>
          {renderVendorGrid(rejected)}
        </div>
      )}

      {/* Admin – Vendor Users */}
      {/* <VendorUsersList /> */}
    </div>
  );
}

export default Admin;

