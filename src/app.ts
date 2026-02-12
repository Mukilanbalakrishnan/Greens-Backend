  import express from "express";
  import cors from "cors";
  import apiRoutes from "./routes/index";
  import path from "path";
import fs from "fs"
  const app = express();
const allowedOrigins = [
  'http://localhost:4000', // Your current frontend
  'http://localhost:5173', // Vite default
  'http://localhost:3000', // React default
  'http://localhost:5174',
];
  // app.use(cors());
app.use(cors({
  origin: '*', // Allow all origins (for development only!)
  credentials: false, // Must be false when origin is '*'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders:['Content-Disposition']
}));
  app.use(express.json());

  /* 🔥 SERVE UPLOADS CORRECTLY */


// Keep the general one for other uploads
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    maxAge: 0,
    etag: false, // Optional: prevents the browser from using 'If-None-Match' checks
    lastModified: false, // Optional: ensures the browser doesn't try to validate the file date
  setHeaders: (res, filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  /* ---------------- VIDEO ---------------- */
  if (ext === ".mp4") {
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Accept-Ranges", "bytes");
  }

  if (ext === ".webm") {
    res.setHeader("Content-Type", "video/webm");
    res.setHeader("Accept-Ranges", "bytes");
  }

  if (ext === ".mov") {
    res.setHeader("Content-Type", "video/quicktime");
    res.setHeader("Accept-Ranges", "bytes");
  }

  if (ext === ".avi") {
    res.setHeader("Content-Type", "video/x-msvideo");
    res.setHeader("Accept-Ranges", "bytes");
  }

  /* ---------------- PDF ---------------- */
  if (ext === ".pdf") {
    res.setHeader("Content-Type", "application/pdf");
  }

  /* ---------------- WORD ---------------- */
  if (ext === ".doc") {
    res.setHeader("Content-Type", "application/msword");
  }

  if (ext === ".docx") {
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
  }

  /* ---------------- POWERPOINT ---------------- */
  if (ext === ".ppt") {
    res.setHeader("Content-Type", "application/vnd.ms-powerpoint");
  }

  if (ext === ".pptx") {
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );
  }

  /* ---------------- EBOOKS ---------------- */
  if (ext === ".epub") {
    res.setHeader("Content-Type", "application/epub+zip");
  }

  if (ext === ".mobi") {
    res.setHeader("Content-Type", "application/x-mobipocket-ebook");
  }

  /* ---------------- IMAGES ---------------- */
  if (ext === ".jpg" || ext === ".jpeg") {
    res.setHeader("Content-Type", "image/jpeg");
  }

  if (ext === ".png") {
    res.setHeader("Content-Type", "image/png");
  }

  if (ext === ".webp") {
    res.setHeader("Content-Type", "image/webp");
  }
}
  })
);
app.use(cors());
const debugPath = path.join(process.cwd(), "uploads", "materials");
console.log("Checking folder:", debugPath);
console.log("Folder exists?", fs.existsSync(debugPath));
if (fs.existsSync(debugPath)) {
  console.log("Files inside:", fs.readdirSync(debugPath));
}
  // API ROUTES
  app.use("/api", apiRoutes);

  // Health check
  app.get("/", (_req, res) => {
    res.send("API is running");
  });

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  export default app;
