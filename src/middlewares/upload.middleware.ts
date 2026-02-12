import multer from "multer";
import path from "path";
import fs from "fs";

/* ---------- HELPER ---------- */
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/* =====================================================
   🔵 ENROLL / GENERIC IMAGE UPLOAD
===================================================== */
const enrollDir = "uploads/enroll";
ensureDir(enrollDir);

const enrollStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, enrollDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

export const upload = multer({
  storage: enrollStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

/* =====================================================
   🟦 ENROLL CARD IMAGE UPLOAD
===================================================== */
const enrollCardDir = "uploads/enroll-cards";
ensureDir(enrollCardDir);

const enrollCardStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, enrollCardDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadEnrollCardImage = multer({
  storage: enrollCardStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp/;
    const valid =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());

    if (!valid) return cb(new Error("Only image files allowed"));
    cb(null, true);
  },
});
export const handleUploadError = (
  err: any,
  req: any,
  res: any,
  next: any
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};
/* =====================================================
   🟢 TESTIMONIAL IMAGE UPLOAD
===================================================== */
const testimonialDir = "uploads/testimonials";
ensureDir(testimonialDir);

const testimonialStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, testimonialDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadTestimonialImage = multer({
  storage: testimonialStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const isValid =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());

    if (!isValid) return cb(new Error("Only image files allowed"));
    cb(null, true);
  },
});
/* =====================================================
   🟣 PROJECT IMAGE UPLOAD
===================================================== */
const projectDir = "uploads/projects";
ensureDir(projectDir);

const projectStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, projectDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadProjectImage = multer({
  storage: projectStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/* ================= VIDEO TESTIMONIAL IMAGE ================= */
const videoDir = "uploads/videos";
ensureDir(videoDir);

const videoStorage = multer.diskStorage({
  destination: videoDir,
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

export const uploadVideoImage = multer({
  storage: videoStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});




/* =====================================================
   🟢 TECH STACK ICON UPLOAD

/* =====================================================
   🟢 TECH STACK IMAGE UPLOAD
===================================================== */
const techStackDir = "uploads/tech-stack";
ensureDir(techStackDir);

const techStackStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, techStackDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadTechStackImage = multer({
  storage: techStackStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});


const domainImageDir = "uploads/domains/thumbnails";

if (!fs.existsSync(domainImageDir)) {
  fs.mkdirSync(domainImageDir, { recursive: true });
}

export const uploadDomainThumbnail = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, domainImageDir),
    filename: (_req, file, cb) => {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    allowed.test(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only image files allowed"));
  },
});
/* =====================================================
   🟡 COURSE IMAGE UPLOAD
===================================================== */
const courseDir = "uploads/courses";
ensureDir(courseDir);

const courseStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, courseDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

export const uploadCourseImage = multer({
  storage: courseStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp/;
    const valid =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());

    if (!valid) return cb(new Error("Only image files allowed"));
    cb(null, true);
  },
});
/* =====================================================
   🔴 HERO IMAGE UPLOAD (MULTIPLE IMAGES)
===================================================== */
const heroDir = "uploads/heroes";
ensureDir(heroDir);

const heroStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, heroDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadHeroImages = multer({
  storage: heroStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp/;
    const valid =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());

    if (!valid) return cb(new Error("Only image files allowed"));
    cb(null, true);
  },
});
/* =====================================================
   🔵 ABOUT IMAGE UPLOAD (MAIN + SMALL)
===================================================== */
const aboutDir = "uploads/about";
ensureDir(aboutDir);

const aboutStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, aboutDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadAboutImages = multer({
  storage: aboutStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp/;
    const valid =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());

    if (!valid) return cb(new Error("Only image files allowed"));
    cb(null, true);
  },
});
/* =====================================================
   🔵 TRAINER ABOUT IMAGE UPLOAD (MAIN + SMALL)
===================================================== */
const trainerAboutDir = "uploads/trainer-about";
ensureDir(trainerAboutDir);

const trainerAboutStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, trainerAboutDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadTrainerAboutImages = multer({
  storage: trainerAboutStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp/;
    const valid =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());

    if (!valid) return cb(new Error("Only image files allowed"));
    cb(null, true);
  },
});
/* =====================================================
   🟣 CERTIFICATE IMAGE UPLOAD
===================================================== */
const certificateDir = "uploads/certificates";
ensureDir(certificateDir);

const certificateStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, certificateDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadCertificateImage = multer({
  storage: certificateStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp/;
    const valid =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());

    if (!valid) return cb(new Error("Only image files allowed"));
    cb(null, true);
  },
});

/* =====================================================
   🟢 STUDENT SUCCESS IMAGE UPLOAD
===================================================== */
const studentSuccessDir = "uploads/student-success";
ensureDir(studentSuccessDir);

const studentSuccessStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, studentSuccessDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadStudentSuccessImage = multer({
  storage: studentSuccessStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp/;
    const valid =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());

    if (!valid) return cb(new Error("Only image files allowed"));
    cb(null, true);
  },
});
/* =====================================================
   🟣 PROJECT THUMBNAIL IMAGE UPLOAD
===================================================== */
const projectThumbnailDir = "uploads/projects";
ensureDir(projectThumbnailDir);

const projectThumbnailStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, projectThumbnailDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    );
  },
});

export const uploadProjectThumbnail = multer({
  storage: projectThumbnailStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp/;
    const valid =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());

    if (!valid) {
      return cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  },
});

//mail upload
const mailDir = "uploads/mail-attachments";
ensureDir(mailDir);
// Storage config
const mailStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, mailDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "_");

    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

// File filter
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedExt = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
    ".jpg",
    ".jpeg",
    ".png",
    ".zip",
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported attachment type"));
  }
};

// ✅ Export multer instance
export const mailUpload = multer({
  storage: mailStorage, // ✅ CORRECT KEY
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },
  fileFilter,
});

/* =====================================================
   📚 STUDY MATERIAL FILE UPLOAD
===================================================== */
const materialDir = "uploads/study-materials";
ensureDir(materialDir);

const materialStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, materialDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nameOnly = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${nameOnly}${ext}`);
  },
});

export const uploadStudyMaterial = multer({
  storage: materialStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  // FIX: Remove explicit 'Request' type to prevent conflict with browser types
  // Multer's internal types will automatically apply the correct Express Request type
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".docx", ".doc", ".ppt", ".pptx", ".mp4", ".webm",".avi",".mov",".key",".jpg",".webp",
    ".jpeg",
    ".png",];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type") as any, false);
    }
  },
});
 /* =====================================================
   🎬 VIDEO TESTIMONIAL THUMBNAIL IMAGE UPLOAD
===================================================== */
const videoThumbnailDir = "uploads/video-thumbnails";
ensureDir(videoThumbnailDir);

const videoThumbnailStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, videoThumbnailDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

export const uploadVideoThumbnailImage = multer({
  storage: videoThumbnailStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp/;
    const valid =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());

    if (!valid) {
      return cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  },
});


/* =====================================================
   🎬 YOUTUBE SHORTS THUMBNAIL UPLOAD
===================================================== */
const youtubeShortsDir = "uploads/youtube-shorts-thumbnails";
ensureDir(youtubeShortsDir);

const youtubeShortsStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, youtubeShortsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

export const uploadYouTubeShortsThumbnail = multer({
  storage: youtubeShortsStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp/;
    const valid =
      allowed.test(file.mimetype) &&
      allowed.test(path.extname(file.originalname).toLowerCase());

    if (!valid) return cb(new Error("Only image files allowed"));
    cb(null, true);
  },
});