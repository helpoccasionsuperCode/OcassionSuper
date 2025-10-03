const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const helmet = require("helmet");
const streamifier = require("streamifier");
require("dotenv").config();

// --- Route Imports ---
const { vendorRegisterRoute } = require("./routes/vendorRegisterRoute");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const vendorProfileRoutes = require("./routes/vendorProfileRoutes");
const mailRoutes = require("./routes/mailRoutes");
const publicRoutes = require("./routes/publicRoutes");
// const vendorRequestRoutes = require("./routes/vendorRequestRoutes"); // Added missing route

const app = express();
const upload = multer();
app.use(helmet());

const connectDB = require("./config/db");

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    console.log("Server will start without database connection");
  });

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://occasionsuper.in',
  'https://ocassion-super.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);
console.log("Allowed Origins:", allowedOrigins);

// ✅ Enable CORS
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Ocassionsuper backend is running");
})

// --- API Routes ---
// All API routes are now consolidated under the /api prefix for consistency.
app.use("api/register/vendor", vendorRegisterRoute);
app.use("api/auth", authRoutes); // More specific path
app.use("api/profile", vendorProfileRoutes); // More specific path
app.use("api/admin", adminRoutes);
app.use("api/public", publicRoutes);
// app.use("/api/requests", vendorRequestRoutes); // Added missing route
app.use("api/vendorEmail", mailRoutes);

// --- Utility & Upload Routes ---

/**
 * @description Provides city suggestions from OpenStreetMap's Nominatim service.
 * This is a proxy to avoid exposing the frontend to a third-party API directly.
 */
app.get("/api/cities", async (req, res) => {
  const query = req.query.q;
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&countrycodes=in&format=json&limit=5`,
      {
        headers: {
          "User-Agent": "EventPlannerApp/1.0 (youremail@example.com)",
          "Accept-Language": "en",
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Nominatim fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// File upload route
app.post("/api/upload", upload.array("files", 10), async (req, res) => { // Allow multiple files
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: "No files uploaded." });
  }
  try {
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "vendor_uploads" },
          (error, result) => (result ? resolve(result) : reject(error))
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    })

    const results = await Promise.all(uploadPromises);
    const urls = results.map(result => ({ url: result.secure_url, public_id: result.public_id }));

    res.status(200).json({ success: true, message: "Files uploaded successfully", data: urls });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ success: false, message: "Upload failed", error: err.message });
  }
});

// --- Error Handling ---
// 404 Handler for API routes
app.use('/api', (req, res, next) => {
  res.status(404).json({ success: false, message: `API endpoint not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log("Ocassionsuper backend is running 🚀");
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;