import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VendorUsersList from "./VendorUsersList";

function Admin() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");
  const [viewer, setViewer] = useState(null); // { url, type, title, isObjectUrl }
  const [vendorUserEmails, setVendorUserEmails] = useState(new Set());
  const [vendorSearch, setVendorSearch] = useState("");
  const [mediaByVendor, setMediaByVendor] = useState({});
  const [mediaLoadingId, setMediaLoadingId] = useState("");

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
      // Try fetching as blob so we can force inline preview via object URL
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(`Failed to load file (${res.status})`);
      const contentType = res.headers.get("content-type") || "";
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const type = detectTypeFromMime(contentType) || detectTypeFromExt(url);
      setViewer({ url: objectUrl, type, title, isObjectUrl: true });
    } catch (e) {
      // Fallback: open original URL in iframe if possible
      const type = detectTypeFromExt(url);
      setViewer({ url, type, title, isObjectUrl: false });
    }
  };

  const downloadFile = async (url, filenameHint = "download", opts = { fallbackOpen: true }) => {
    const attemptFetch = async (credentialsMode) => {
      const res = await fetch(url, { credentials: credentialsMode, referrerPolicy: "no-referrer" });
      if (!res.ok) throw new Error(`Failed with ${res.status}`);
      return res.blob();
    };

    try {
      let blob = null;
      try {
        // First try without credentials (most public CDNs)
        blob = await attemptFetch("omit");
      } catch (_) {
        // Retry with credentials in case the server requires cookies
        blob = await attemptFetch("include");
      }
      // If filename has no extension, try to infer from MIME type
      const hasExtension = /\.[a-z0-9]+$/i.test(filenameHint || "");
      if (!hasExtension && blob && blob.type) {
        const mime = String(blob.type || "").toLowerCase();
        const mimeToExt = {
          "image/jpeg": ".jpg",
          "image/jpg": ".jpg",
          "image/png": ".png",
          "image/gif": ".gif",
          "image/webp": ".webp",
          "image/avif": ".avif",
          "video/mp4": ".mp4",
          "video/webm": ".webm",
          "video/ogg": ".ogv",
          "application/pdf": ".pdf"
        };
        const inferred = mimeToExt[mime];
        if (inferred) {
          filenameHint = `${filenameHint}${inferred}`;
        }
      }
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filenameHint || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (e) {
      if (opts?.fallbackOpen) {
        try { window.open(url, "_blank"); return; } catch (_) { }
      }
      alert("Download failed. The file host may be blocking downloads from this site (CORS). Try opening the preview and saving manually.");
      try { console.error("Download error", e); } catch (_) { }
    }
  };

  const getFilenameFromUrl = (url = "", fallback = "download") => {
    try {
      const u = new URL(url, window.location.origin);
      const last = (u.pathname.split("/").pop() || "").trim();
      if (last) return last;
      return fallback;
    } catch (_) {
      const parts = String(url).split("?")[0].split("/");
      const last = parts[parts.length - 1] || "";
      return last || fallback;
    }
  };

  const closePreview = () => {
    if (viewer?.isObjectUrl && viewer?.url) {
      try { URL.revokeObjectURL(viewer.url); } catch (_) { }
    }
    setViewer(null);
  };

  const fetchVendorUsers = async (signal) => {
    const base = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const usersRes = await fetch(`${base}/api/admin/users/vendors`, { credentials: "include", signal });
    if (!usersRes.ok) {
      const body = await usersRes.json().catch(() => ({}));
      throw new Error(body.message || `Users failed with ${usersRes.status}`);
    }
    const usersData = await usersRes.json();
    const emailSet = new Set((Array.isArray(usersData?.data) ? usersData.data : []).map(u => String(u.email || "").toLowerCase().trim()));
    setVendorUserEmails(emailSet);
  };

  // Fetch vendors and vendor users
  useEffect(() => {
    const controller = new AbortController();
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");
        const base = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        const vendorsRes = await fetch(`${base}/api/admin/vendors`, { credentials: "include", signal: controller.signal });
        if (!vendorsRes.ok) {
          const body = await vendorsRes.json().catch(() => ({}));
          throw new Error(body.message || `Vendors failed with ${vendorsRes.status}`);
        }
        const vendorsData = await vendorsRes.json();
        setVendors(Array.isArray(vendorsData?.data) ? vendorsData.data : []);
        await fetchVendorUsers(controller.signal);
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

  const updateStatus = async (vendorId, status) => {
    try {
      setSavingId(vendorId);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/admin/vendors/${vendorId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Failed to update status (${res.status})`);
      }
      const { data } = await res.json();
      setVendors(prev => prev.map(v => (v._id === vendorId ? { ...v, status: data.status } : v)));
      // Refresh vendor users after rejection so UI updates without page reload
      if (status === "rejected") {
        await fetchVendorUsers();
        // Notify other components/pages to refresh vendor users
        try { window.dispatchEvent(new CustomEvent("vendor-users-refresh")); } catch (_) { }
      }
    } catch (e) {
      alert(e.message || "Failed to update status");
    } finally {
      setSavingId("");
    }
  };

  const loadVendorMedia = async (vendorId) => {
    try {
      setMediaLoadingId(vendorId);
      const base = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const res = await fetch(`${base}/api/admin/vendors/${vendorId}`, { credentials: "include" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Failed to fetch vendor details (${res.status})`);
      }
      const { data } = await res.json();
      const media = {
        images: Array.isArray(data?.images) ? data.images : [],
        videos: Array.isArray(data?.videos) ? data.videos : [],
        documents: typeof data?.documents === "object" && data.documents ? data.documents : {},
        files: Array.isArray(data?.files) ? data.files : [],
        attachments: Array.isArray(data?.attachments) ? data.attachments : [],
      };
      setMediaByVendor((prev) => ({ ...prev, [vendorId]: media }));
    } catch (e) {
      alert(e.message || "Failed to load vendor media");
    } finally {
      setMediaLoadingId("");
    }
  };

  const normalizedQuery = String(vendorSearch || "").toLowerCase().trim();
  const filteredVendors = normalizedQuery
    ? vendors.filter(v => {
      const owner = String(v.ownerName || "").toLowerCase();
      const email = String(v.email || "").toLowerCase();
      return owner.includes(normalizedQuery) || email.includes(normalizedQuery);
    })
    : vendors;

  const pending = filteredVendors.filter(v => (v.status || "").toLowerCase() === "pending");
  const approved = filteredVendors.filter(v => (v.status || "").toLowerCase() === "approved");
  const rejected = filteredVendors.filter(v => (v.status || "").toLowerCase() === "rejected");

  const VendorCard = (v) => {
    const statusLower = (v.status || "").toLowerCase();
    const vendorEmailLower = String(v.email || "").toLowerCase().trim();
    const userExistsForEmail = vendorUserEmails.has(vendorEmailLower);
    return (
      <div key={v._id || v.userId}
        style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontWeight: 600 }}>{v.businessName}</span>
          <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 9999, background: "#f3f4f6" }}>
            {v.status}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {statusLower !== "approved" && (
            <button onClick={() => updateStatus(v._id, "approved")} disabled={savingId === v._id} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #10b981", background: "#10b981", color: "#fff", cursor: "pointer" }}>Approve</button>
          )}
          {statusLower !== "rejected" && (
            <button onClick={() => updateStatus(v._id, "rejected")} disabled={savingId === v._id} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ef4444", background: "#ef4444", color: "#fff", cursor: "pointer" }}>Reject</button>
          )}
          {statusLower === "approved" && !userExistsForEmail && (
            <button onClick={() => navigate(`/admin/vendor-users/${v._id}`)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #3b82f6", background: "#3b82f6", color: "#fff", cursor: "pointer" }}>Create User</button>
          )}
        </div>
        <div style={{ fontSize: 14, color: "#374151" }}>
          <div><strong>Owner:</strong> {v.ownerName}</div>
          <div><strong>Email:</strong> {v.email}</div>
          <div><strong>Phone:</strong> {v.phone}</div>
          <div><strong>City:</strong> {v.city}</div>
          <div><strong>Service Area:</strong> {v.serviceArea}</div>
          {/* <div><strong>Categories:</strong> {(v.categories || []).join(", ")}</div> */}
          <div>
            <strong>Categories:</strong>{" "}
            {(() => {
              const cats = Array.isArray(v.categories) ? [...v.categories] : [];
              const base = cats.join(", ");
              let extras = "";

              // Only append extras if user picked Others and actually filled something
              if (
                cats.some(c => c.toLowerCase() === "others") &&
                v.othersCategories &&
                v.othersCategories.length
              ) {
                // v.othersCategories could be string or array; normalize
                const others =
                  Array.isArray(v.othersCategories)
                    ? v.othersCategories.join(", ")
                    : v.othersCategories;
                extras = ` – ${others}`;
              }

              return `${base}${extras}`;
            })()}
          </div>

          {v.socialMedia && (
            <div><strong>Social:</strong> <a href={v.socialMedia} target="_blank" rel="noreferrer">{v.socialMedia}</a></div>
          )}
          <div><strong>Active:</strong> {v.isActive ? "Yes" : "No"}</div>
          {v.bankDetails && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Bank Details</div>
              <div><strong>Holder:</strong> {v.bankDetails.accountHolder || "-"}</div>
              <div><strong>Account #:</strong> {v.bankDetails.accountNumber || "-"}</div>
              <div><strong>IFSC:</strong> {v.bankDetails.ifsc || "-"}</div>
            </div>
          )}
          {v.verificationStatus && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Verification</div>
              <div><strong>Email:</strong> {v.verificationStatus.emailVerified ? "Verified" : "Not Verified"}</div>
              <div><strong>Phone:</strong> {v.verificationStatus.phoneVerified ? "Verified" : "Not Verified"}</div>
              <div><strong>Documents:</strong> {v.verificationStatus.documentsVerified ? "Verified" : "Not Verified"}</div>
            </div>
          )}
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
            Created: {v.createdAt ? new Date(v.createdAt).toLocaleString() : "-"}
          </div>
        </div>

        {(v.images?.length || v.videos?.length) && (
          <div style={{ marginTop: 12 }}>
            {Array.isArray(v.images) && v.images.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Images</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {v.images.map((url, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => openPreview(url, `Image ${idx + 1}`)} style={{ color: "#2563eb", textAlign: "left", background: "transparent", border: 0, padding: 0, cursor: "pointer" }}>View Image {idx + 1}</button>
                      <button onClick={() => downloadFile(url, getFilenameFromUrl(url, `image-${idx + 1}`), { fallbackOpen: false })} style={{ fontSize: 12, padding: "2px 6px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer" }}>Download</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(v.videos) && v.videos.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Videos</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {v.videos.map((url, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => openPreview(url, `Video ${idx + 1}`)} style={{ color: "#2563eb", textAlign: "left", background: "transparent", border: 0, padding: 0, cursor: "pointer" }}>View Video {idx + 1}</button>
                      <button onClick={() => downloadFile(url, getFilenameFromUrl(url, `video-${idx + 1}`))} style={{ fontSize: 12, padding: "2px 6px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer" }}>Download</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {v.documents && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Documents</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Array.isArray(v.documents.gst) && v.documents.gst.length > 0 && (
                <div>
                  <div style={{ fontWeight: 500 }}>GST</div>
                  {v.documents.gst.map((url, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => openPreview(url, `GST ${idx + 1}`)} style={{ color: "#2563eb", textAlign: "left", background: "transparent", border: 0, padding: 0, cursor: "pointer" }}>View GST {idx + 1}</button>
                      <button onClick={() => downloadFile(url, getFilenameFromUrl(url, `gst-${idx + 1}`))} style={{ fontSize: 12, padding: "2px 6px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer" }}>Download</button>
                    </div>
                  ))}
                </div>
              )}
              {Array.isArray(v.documents.businessProof) && v.documents.businessProof.length > 0 && (
                <div>
                  <div style={{ fontWeight: 500 }}>Business Proof</div>
                  {v.documents.businessProof.map((url, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => openPreview(url, `Business Proof ${idx + 1}`)} style={{ color: "#2563eb", textAlign: "left", background: "transparent", border: 0, padding: 0, cursor: "pointer" }}>View Business Proof {idx + 1}</button>
                      <button onClick={() => downloadFile(url, getFilenameFromUrl(url, `business-proof-${idx + 1}`))} style={{ fontSize: 12, padding: "2px 6px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer" }}>Download</button>
                    </div>
                  ))}
                </div>
              )}
              {Array.isArray(v.documents.idProof) && v.documents.idProof.length > 0 && (
                <div>
                  <div style={{ fontWeight: 500 }}>ID Proof</div>
                  {v.documents.idProof.map((url, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => openPreview(url, `ID Proof ${idx + 1}`)} style={{ color: "#2563eb", textAlign: "left", background: "transparent", border: 0, padding: 0, cursor: "pointer" }}>View ID Proof {idx + 1}</button>
                      <button onClick={() => downloadFile(url, getFilenameFromUrl(url, `id-proof-${idx + 1}`))} style={{ fontSize: 12, padding: "2px 6px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer" }}>Download</button>
                    </div>
                  ))}
                </div>
              )}

              {Object.entries(v.documents)
                .filter(([key, val]) => !["gst", "businessProof", "idProof"].includes(key) && Array.isArray(val) && val.length > 0)
                .map(([key, arr]) => (
                  <div key={key}>
                    <div style={{ fontWeight: 500 }}>{key}</div>
                    {arr.map((url, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={() => openPreview(url, `${key} ${idx + 1}`)} style={{ color: "#2563eb", textAlign: "left", background: "transparent", border: 0, padding: 0, cursor: "pointer" }}>View {key} {idx + 1}</button>
                        <button onClick={() => downloadFile(url, getFilenameFromUrl(url, `${key}-${idx + 1}`))} style={{ fontSize: 12, padding: "2px 6px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer" }}>Download</button>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        )}

        {(Array.isArray(v.files) && v.files.length > 0) && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Files</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {v.files.map((url, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => openPreview(url, `File ${idx + 1}`)} style={{ color: "#2563eb", textAlign: "left", background: "transparent", border: 0, padding: 0, cursor: "pointer" }}>View File {idx + 1}</button>
                  <button onClick={() => downloadFile(url, getFilenameFromUrl(url, `file-${idx + 1}`))} style={{ fontSize: 12, padding: "2px 6px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer" }}>Download</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {(Array.isArray(v.attachments) && v.attachments.length > 0) && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Attachments</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {v.attachments.map((url, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => openPreview(url, `Attachment ${idx + 1}`)} style={{ color: "#2563eb", textAlign: "left", background: "transparent", border: 0, padding: 0, cursor: "pointer" }}>View Attachment {idx + 1}</button>
                  <button onClick={() => downloadFile(url, getFilenameFromUrl(url, `attachment-${idx + 1}`))} style={{ fontSize: 12, padding: "2px 6px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer" }}>Download</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(v.packages) && v.packages.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Packages</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
              {v.packages.map((p, idx) => (
                <div key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: 8 }}>
                  <div style={{ fontWeight: 600 }}>{p.title}</div>
                  <div style={{ color: "#111827" }}><strong>Price:</strong> {p.price}</div>
                  <div style={{ color: "#374151" }}>{p.description}</div>
                  {p.inclusions && <div style={{ color: "#6b7280", fontSize: 12 }}>Inclusions: {p.inclusions}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: "16px", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Admin - Vendors</h1>

      {loading && <p>Loading vendors...</p>}
      {error && (
        <div style={{ color: "#b00020", marginBottom: 12 }}>Error: {error}</div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <input
          value={vendorSearch}
          onChange={(e) => setVendorSearch(e.target.value)}
          placeholder="Search by owner name or email"
          style={{ flex: 1, maxWidth: 420, border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px" }}
        />
      </div>

      {!loading && !error && vendors.length === 0 && (
        <p>No vendors found.</p>
      )}

      {/* Pending */}
      {pending && pending.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "12px 0" }}>Pending ({pending.length})</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {pending.map((v) => VendorCard(v))}
          </div>
        </div>
      )}

      {/* Approved */}
      {approved && approved.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "12px 0" }}>Approved ({approved.length})</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {approved.map((v) => VendorCard(v))}
          </div>
        </div>
      )}

      {/* Rejected */}
      {rejected && rejected.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "12px 0" }}>Rejected ({rejected.length})</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {rejected.map((v) => VendorCard(v))}
          </div>
        </div>
      )}

      {/* Viewer Modal */}
      {viewer && (
        <div onClick={closePreview} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 1000 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#111", borderRadius: 8, maxWidth: "90vw", maxHeight: "90vh", width: "min(1000px, 90vw)", color: "#fff", padding: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: 600 }}>{viewer.title || "Preview"}</div>
              <button onClick={closePreview} style={{ background: "transparent", color: "#fff", border: 0, fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ background: "#000", display: "flex", alignItems: "center", justifyContent: "center", maxHeight: "80vh", overflow: "auto" }}>
              {viewer.type === "image" && (
                <img src={viewer.url} alt={viewer.title} style={{ maxWidth: "100%", maxHeight: "80vh" }} />
              )}
              {viewer.type === "video" && (
                <video src={viewer.url} style={{ maxWidth: "100%", maxHeight: "80vh" }} controls />
              )}
              {viewer.type === "pdf" && (
                <iframe title={viewer.title} src={viewer.url} style={{ width: "85vw", height: "80vh", border: 0 }} />
              )}
              {viewer.type === "unknown" && (
                <div style={{ padding: 16 }}>
                  <div>Cannot preview this file type.</div>
                  <a href={viewer.url} target="_blank" rel="noreferrer" style={{ color: "#60a5fa" }}>Open in new tab</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <VendorUsersList />
    </div>
  );
}

export default Admin;


