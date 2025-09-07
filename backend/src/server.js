const express = require("express");
const cors = require("cors");
const multer = require("multer");
const streamifier = require("streamifier");
const { v2: cloudinary } = require("cloudinary");
const helmet = require("helmet");
const {vendorRegisterRoute} = require("./routes/vendorRegisterRoute");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();

const app = express();
const upload = multer();
app.use(express.json());
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

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

app.get("/", (req,res) => {
    res.send("Ocassionsuper backend is running");
})

app.use("/api/register/vendor", vendorRegisterRoute); 
app.use("/api/admin", adminRoutes);

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



app.post("/api/vendors", (req, res) => {
  console.log(req.body);
  res.json({ message: "Vendor registered successfully ✅" });
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// File upload route
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "vendor_uploads" },
        (error, result) => (result ? resolve(result) : reject(error))
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(PORT, () => {
    console.log("Ocassionsuper backend is running 🚀");
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;