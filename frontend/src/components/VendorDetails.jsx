import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function VendorDetails() {
  const { id } = useParams();
  // console.log(id);
  
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewer, setViewer] = useState(null); // { url, type, title, isObjectUrl }
  const [saving, setSaving] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [checkingUser, setCheckingUser] = useState(false);

  console.log("Environment check:", {
    backendUrl: import.meta.env.VITE_BACKEND_URL,
    nodeEnv: import.meta.env.NODE_ENV,
    mode: import.meta.env.MODE
  });

  const detectTypeFromExt = (url = "") => {
    const lower = String(url).toLowerCase();
    if (/(\.png|\.jpg|\.jpeg|\.gif|\.webp|\.avif)$/.test(lower)) return "image";
    if (/(\.mp4|\.webm|\.ogg)$/.test(lower)) return "video";
    if (/(\.pdf)$/.test(lower)) return "pdf";
    return "unknown";
  };

  const detectTypeFromMime = (mime = "") => {
    if (!mime) return null;
    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("video/")) return "video";
    if (mime === "application/pdf") return "pdf";
    return null;
  };

  const openPreview = async (url, title) => {
    try {
      // Check if it's a Cloudinary URL
      const isCloudinary = url.includes('res.cloudinary.com');

      let res;
      if (isCloudinary) {
        // For Cloudinary URLs, don't include credentials to avoid CORS issues
        res = await fetch(url, {
          mode: 'cors',
          credentials: 'omit'
        });
      } else {
        // For other URLs, include credentials
        res = await fetch(url, { credentials: "include" });
      }

      if (!res.ok) throw new Error(`Failed to load file (${res.status})`);
      const contentType = res.headers.get("content-type") || "";
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const type = detectTypeFromMime(contentType) || detectTypeFromExt(url);
      setViewer({ url: objectUrl, type, title, isObjectUrl: true });
    } catch (e) {
      console.error("Preview failed:", e);
      // Fallback: use original URL directly
      const type = detectTypeFromExt(url);
      setViewer({ url, type, title, isObjectUrl: false });
    }
  };

  const downloadFile = async (url, filenameHint = "download") => {
    try {
      // Check if it's a Cloudinary URL
      const isCloudinary = url.includes('res.cloudinary.com');

      let res;
      if (isCloudinary) {
        // For Cloudinary URLs, don't include credentials to avoid CORS issues
        res = await fetch(url, {
          mode: 'cors',
          credentials: 'omit'
        });
      } else {
        // For other URLs, include credentials
        res = await fetch(url, { credentials: "include" });
      }

      if (!res.ok) throw new Error(`Failed with ${res.status}`);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filenameHint;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Clean up the object URL
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } catch (e) {
      console.error("Download failed:", e);
      // Fallback: open in new tab
      try {
        window.open(url, '_blank');
      } catch (fallbackError) {
        alert("Download failed. Please try right-clicking the link and selecting 'Save as'.");
      }
    }
  };

  const getFilenameFromUrl = (url = "", fallback = "download") => {
    try {
      const u = new URL(url, window.location.origin);
      let filename = u.pathname.split("/").pop() || "";

      // For Cloudinary URLs, try to extract a better filename
      if (url.includes('res.cloudinary.com')) {
        const pathParts = u.pathname.split('/');
        if (pathParts.length > 2) {
          // Extract the actual filename from Cloudinary path
          const cloudinaryFilename = pathParts[pathParts.length - 1];
          if (cloudinaryFilename && cloudinaryFilename.includes('.')) {
            filename = cloudinaryFilename;
          }
        }
      }

      return filename.trim() || fallback;
    } catch (_) {
      const parts = String(url).split("?")[0].split("/");
      const last = parts[parts.length - 1] || "";
      return last || fallback;
    }
  };

  const closePreview = () => {
    if (viewer?.isObjectUrl && viewer?.url) {
      try {
        URL.revokeObjectURL(viewer.url);
      } catch (_) { }
    }
    setViewer(null);
  };

  const checkUserExists = async (email) => { 
    if (!email) return;

    try {
      setCheckingUser(true);
      const base = import.meta.env.VITE_BACKEND_URL || "https://ocassionsuper.onrender.com";
      const res = await fetch(`${base}/api/admin/users/vendors?search=${encodeURIComponent(email)}`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        const userExists = data.data && data.data.some(user =>
          user.email && user.email.toLowerCase() === email.toLowerCase()
        );
        setUserExists(userExists);
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
      setUserExists(false);
    } finally {
      setCheckingUser(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchVendor = async () => { 
      try {
        setLoading(true);
        setError("");
        const base =
          import.meta.env.VITE_BACKEND_URL || "https://ocassionsuper.onrender.com";
        
        console.log("Fetching vendor from:", `${base}/api/admin/vendors/${id}`);
        
        const res = await fetch(`${base}/api/admin/vendors/${id}`, {
          credentials: "include",
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log("Response status:", res.status);
        console.log("Response headers:", Object.fromEntries(res.headers.entries()));

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          console.error("API Error:", body);
          throw new Error(body.message || `Failed with ${res.status}`);
        }
        const responseData = await res.json();
        console.log("Vendor data received:", responseData);
        setVendor(responseData.data);

        // Check if user already exists for this vendor's email
        if (responseData.data && responseData.data.email) {
          checkUserExists(responseData.data.email);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
          setError(err.message || "Failed to load vendor");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
    return () => controller.abort();
  }, [id]);

  const updateStatus = async (nextStatus) => {
    try {
      setSaving(true);
      const base =
        import.meta.env.VITE_BACKEND_URL || "https://ocassionsuper.onrender.com";
      const res = await fetch(`${base}/api/admin/vendors/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
        credentials: "include",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Failed with ${res.status}`);
      }
      const { data } = await res.json();
      setVendor((prev) => ({ ...prev, status: data.status }));
    } catch (e) {
      alert(e.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 16 }}>Loading vendor details…</div>;
  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ color: "red", marginBottom: 16 }}>Error: {error}</div>
        <div style={{ fontSize: 14, color: "#666" }}>
          <p>Debugging information:</p>
          <ul>
            <li>Backend URL: {import.meta.env.VITE_BACKEND_URL || "https://ocassionsuper.onrender.com"}</li>
            <li>Vendor ID: {id}</li>
            <li>Environment: {import.meta.env.MODE}</li>
          </ul>
          <p>Please check the browser console for more details.</p>
        </div>
      </div>
    );
  }
  if (!vendor) return <div style={{ padding: 16 }}>No vendor found.</div>;

  return (
    <div style={{ padding: 16, maxWidth: 1200, margin: "0 auto" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 16,
          background: "#e5e7eb",
          border: "none",
          padding: "8px 12px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: 16,
          background: "#fff",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
          {vendor.businessName || "N/A"}
        </h1>
        {/* Action buttons based on status */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {(() => {
            const statusLower = String(vendor.status || "").toLowerCase();
            return (
              <>
                {(statusLower === "approved") && (
                  <>
                    <button
                      onClick={() => updateStatus("rejected")}
                      disabled={saving}
                      style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ef4444", background: "#ef4444", color: "#fff", cursor: "pointer" }}
                    >
                      Reject
                    </button>
                    {/* Only show Create User button for approved vendors without existing users */}
                    {!userExists && !checkingUser && (
                      <button
                        onClick={() => navigate(`/admin/vendor-users/${vendor._id || id}`)}
                        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "#fff", cursor: "pointer" }}
                      >
                        Create User
                      </button>
                    )}
                    {/* Show user exists indicator for approved vendors with existing users */}
                    {userExists && (
                      <span style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #10b981",
                        background: "#dcfce7",
                        color: "#166534",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        👤 User Account Exists
                      </span>
                    )}
                    {/* Show loading indicator while checking user existence */}
                    {checkingUser && (
                      <span style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #d1d5db",
                        background: "#f9fafb",
                        color: "#6b7280",
                        fontSize: "12px"
                      }}>
                        Checking user status...
                      </span>
                    )}
                  </>
                )}
                {(statusLower === "rejected") && (
                  <button
                    onClick={() => updateStatus("approved")}
                    disabled={saving}
                    style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #10b981", background: "#10b981", color: "#fff", cursor: "pointer" }}
                  >
                    Approve
                  </button>
                )}
                {(statusLower === "pending") && (
                  <>
                    <button
                      onClick={() => updateStatus("approved")}
                      disabled={saving}
                      style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #10b981", background: "#10b981", color: "#fff", cursor: "pointer" }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus("rejected")}
                      disabled={saving}
                      style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ef4444", background: "#ef4444", color: "#fff", cursor: "pointer" }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </>
            );
          })()}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <p><strong>Owner:</strong> {vendor.ownerName || "N/A"}</p>
            <p><strong>Email:</strong> {vendor.email || "N/A"}</p>
            <p><strong>Phone:</strong> {vendor.phone || "N/A"}</p>
            <p><strong>Status:</strong>
              <span style={{
                padding: "2px 8px",
                borderRadius: 9999,
                fontSize: 12,
                marginLeft: 8,
                background: vendor.status === "approved" ? "#dcfce7" :
                  vendor.status === "pending" ? "#fef3c7" : "#fecaca",
                color: vendor.status === "approved" ? "#166534" :
                  vendor.status === "pending" ? "#92400e" : "#991b1b"
              }}>
                {vendor.status || "N/A"}
                {vendor.status === "approved" && userExists && (
                  <span style={{ marginLeft: 4, fontSize: 10 }}>👤</span>
                )}
              </span>
            </p>
            <p><strong>City:</strong> {vendor.city || "N/A"}</p>
            <p><strong>Service Area:</strong> {vendor.serviceArea || "N/A"}</p>
          </div>
          <div>
            <p><strong>Categories:</strong>
              {(() => {
                const cats = Array.isArray(vendor.categories) ? [...vendor.categories] : [];
                let extras = "";
                if (cats.some(c => c.toLowerCase() === "others") && vendor.othersCategories && vendor.othersCategories.length) {
                  const others = Array.isArray(vendor.othersCategories) ? vendor.othersCategories.join(", ") : vendor.othersCategories;
                  extras = ` – ${others}`;
                }
                return cats.length > 0 ? `${cats.join(", ")}${extras}` : "N/A";
              })()}
            </p>
            {vendor.socialMedia && (
              <p><strong>Social Media:</strong> <a href={vendor.socialMedia} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>{vendor.socialMedia}</a></p>
            )}
            <p><strong>Active:</strong> {vendor.isActive ? "Yes" : "No"}</p>
            <p><strong>Created:</strong> {vendor.createdAt ? new Date(vendor.createdAt).toLocaleString() : "-"}</p>
            <p><strong>Updated:</strong> {vendor.updatedAt ? new Date(vendor.updatedAt).toLocaleString() : "-"}</p>
          </div>
        </div>

        {/* Bank Details */}
        {vendor.bankDetails && (
          <div style={{ marginTop: 16, padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Bank Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div><strong>Account Holder:</strong> {vendor.bankDetails.accountHolder || "-"}</div>
              <div><strong>Account Number:</strong> {vendor.bankDetails.accountNumber || "-"}</div>
              <div><strong>IFSC Code:</strong> {vendor.bankDetails.ifsc || "-"}</div>
            </div>
          </div>
        )}

        {/* Media */}
        {(vendor.images?.length || vendor.videos?.length) && (
          <div style={{ marginTop: 16, padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Media Files</div>

            {vendor.images?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 500, marginBottom: 8, color: "#374151" }}>Images ({vendor.images.length})</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {vendor.images.map((url, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "#fff", borderRadius: 6, border: "1px solid #d1d5db" }}>
                      <button
                        onClick={() => openPreview(url, `Image ${idx + 1}`)}
                        style={{ color: "#2563eb", background: "transparent", border: "none", cursor: "pointer", fontSize: 14 }}
                      >
                        View Image {idx + 1}
                      </button>
                      <button
                        onClick={() => downloadFile(url, getFilenameFromUrl(url, `image-${idx + 1}`))}
                        style={{ color: "#6b7280", background: "transparent", border: "none", cursor: "pointer", fontSize: 12 }}
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {vendor.videos?.length > 0 && (
              <div>
                <div style={{ fontWeight: 500, marginBottom: 8, color: "#374151" }}>Videos ({vendor.videos.length})</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {vendor.videos.map((url, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "#fff", borderRadius: 6, border: "1px solid #d1d5db" }}>
                      <button
                        onClick={() => openPreview(url, `Video ${idx + 1}`)}
                        style={{ color: "#2563eb", background: "transparent", border: "none", cursor: "pointer", fontSize: 14 }}
                      >
                        View Video {idx + 1}
                      </button>
                      <button
                        onClick={() => downloadFile(url, getFilenameFromUrl(url, `video-${idx + 1}`))}
                        style={{ color: "#6b7280", background: "transparent", border: "none", cursor: "pointer", fontSize: 12 }}
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Documents */}
        {vendor.documents && Object.keys(vendor.documents).length > 0 && (
          <div style={{ marginTop: 16, padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Documents</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              {Object.entries(vendor.documents).map(([key, arr]) =>
                Array.isArray(arr) && arr.length > 0 ? (
                  <div key={key} style={{ background: "#fff", padding: 12, borderRadius: 6, border: "1px solid #d1d5db" }}>
                    <div style={{ fontWeight: 500, marginBottom: 8, textTransform: "capitalize" }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()} ({arr.length})
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {arr.map((url, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", background: "#f9fafb", borderRadius: 4 }}>
                          <button
                            onClick={() => openPreview(url, `${key} ${idx + 1}`)}
                            style={{ color: "#2563eb", background: "transparent", border: "none", cursor: "pointer", fontSize: 14 }}
                          >
                            View {key} {idx + 1}
                          </button>
                          <button
                            onClick={() => downloadFile(url, getFilenameFromUrl(url, `${key}-${idx + 1}`))}
                            style={{ color: "#6b7280", background: "transparent", border: "none", cursor: "pointer", fontSize: 12 }}
                          >
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* Packages */}
        {vendor.packages?.length > 0 && (
          <div style={{ marginTop: 16, padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Service Packages ({vendor.packages.length})</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
              {vendor.packages.map((p, idx) => (
                <div key={idx} style={{ background: "#fff", border: "1px solid #d1d5db", borderRadius: 8, padding: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, color: "#111827" }}>{p.title}</div>
                  <div style={{ fontSize: 18, fontWeight: 500, color: "#059669", marginBottom: 8 }}>₹{p.price}</div>
                  <div style={{ color: "#374151", marginBottom: 8, lineHeight: 1.5 }}>{p.description}</div>
                  {p.inclusions && (
                    <div style={{ fontSize: 14, color: "#6b7280" }}>
                      <strong>Inclusions:</strong> {p.inclusions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Viewer Modal */}
      {viewer && (
        <div
          onClick={closePreview}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#111",
              borderRadius: 8,
              maxWidth: "90vw",
              maxHeight: "90vh",
              width: "min(1000px, 90vw)",
              color: "#fff",
              padding: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: 600 }}>{viewer.title || "Preview"}</div>
              <button onClick={closePreview} style={{ background: "transparent", color: "#fff", border: 0, fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ background: "#000", display: "flex", alignItems: "center", justifyContent: "center", maxHeight: "80vh", overflow: "auto" }}>
              {viewer.type === "image" && <img src={viewer.url} alt={viewer.title} style={{ maxWidth: "100%", maxHeight: "80vh" }} />}
              {viewer.type === "video" && <video src={viewer.url} controls style={{ maxWidth: "100%", maxHeight: "80vh" }} />}
              {viewer.type === "pdf" && <iframe src={viewer.url} title={viewer.title} style={{ width: "100%", height: "80vh" }} />}
              {!["image", "video", "pdf"].includes(viewer.type) && <div>Cannot preview file</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorDetails;
