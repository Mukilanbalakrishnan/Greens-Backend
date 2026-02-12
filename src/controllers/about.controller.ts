// controllers/about.controller.ts
import { Request, Response } from "express";
import { About } from "../models/About.model";
import path from "path";
import fs from "fs";

// Helper function to get files
function getFiles(req: Request, fieldName: string): Express.Multer.File[] {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  return files?.[fieldName] || [];
}

/* ---------- GET (Frontend) ---------- */
export const getAboutData = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let about = await About.findOne({
      where: { domainId, courseId, isActive: true },
    });

    // fallback → domain-level
    if (!about && domainId > 0 && courseId > 0) {
      about = await About.findOne({
        where: { domainId, courseId: 0, isActive: true },
      });
    }

    // fallback → landing
    if (!about) {
      about = await About.findOne({
        where: { domainId: 0, courseId: 0, isActive: true },
      });
    }

    if (!about) {
      return res.status(404).json({ message: "About data not found" });
    }

    res.json(about);
  } catch (error: any) {
    console.error("Error in getAboutData:", error);
    res.status(500).json({ message: "Failed to fetch about data" });
  }
};

/* ---------- GET ALL (Admin) ---------- */
export const getAllAbouts = async (req: Request, res: Response) => {
  try {
    const abouts = await About.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(abouts);
  } catch (error: any) {
    console.error("Error fetching all abouts:", error);
    res.status(500).json({ message: "Failed to fetch all about sections" });
  }
};

/* ---------- CREATE ---------- */
export const createAbout = async (req: Request, res: Response) => {
  try {
    const mainFiles = getFiles(req, 'mainImages');
    
    if (mainFiles.length === 0) {
      return res.status(400).json({ message: "Main images are required" });
    }

    const mainImages = mainFiles.map(
      (file) => `/uploads/about/${file.filename}`
    );

 

    const about = await About.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      label: req.body.label,
      heading: req.body.heading,
      description1: req.body.description1,
      description2: req.body.description2 || '',
      mainImages,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    });

    res.status(201).json({
      message: "About section created successfully",
      about
    });
  } catch (error: any) {
    console.error("Create Error:", error);
    res.status(400).json({ 
      message: "Failed to create about section",
      error: error.message 
    });
  }
};



export const updateAbout = async (req: Request, res: Response) => {
  try {
    const about = await About.findByPk(req.params.id);
    if (!about) {
      return res.status(404).json({ message: "About section not found" });
    }

    // 1. Parse existing images (the ones the user KEPT)
    let keptMainImages: string[] = [];
    
    try {
      keptMainImages = req.body.existingMainImages ? JSON.parse(req.body.existingMainImages) : [];
    } catch (e) {
      keptMainImages = about.mainImages; // Fallback to current if parse fails
    }

    // 2. Identify and Delete files removed by the user
    const imagesToRemove = [
      ...(about.mainImages || []).filter(img => !keptMainImages.includes(img)),
    ];

    imagesToRemove.forEach(imgPath => {
      // imgPath is like "/uploads/about/123.jpg"
      // we need to reach "uploads/about/123.jpg"
      const relativePath = imgPath.startsWith('/') ? imgPath.substring(1) : imgPath;
      const fullPath = path.join(process.cwd(), relativePath);
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    // 3. Process New Uploads
    const newMainFiles = getFiles(req, 'mainImages');

    const newMainPaths = newMainFiles.map(f => `/uploads/about/${f.filename}`);

    // 4. Update Database
    await about.update({
      domainId: req.body.domainId ? Number(req.body.domainId) : about.domainId,
      courseId: req.body.courseId ? Number(req.body.courseId) : about.courseId,
      label: req.body.label || about.label,
      heading: req.body.heading || about.heading,
      description1: req.body.description1 || about.description1,
      description2: req.body.description2 || about.description2,
      // Combine what was kept + what is new
      mainImages: [...keptMainImages, ...newMainPaths],
      isActive: req.body.isActive !== undefined 
        ? (req.body.isActive === 'true' || req.body.isActive === true) 
        : about.isActive,
    });

    res.json({ message: "Updated successfully", about });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------- DELETE ---------- */
export const deleteAbout = async (req: Request, res: Response) => {
  try {
    const about = await About.findByPk(req.params.id);
    if (!about) {
      return res.status(404).json({ message: "About not found" });
    }

    // Delete associated images
    [...(about.mainImages || [])].forEach(imgPath => {
      const filename = imgPath.split('/').pop();
      if (filename) {
        const filePath = path.join('uploads/about', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    await about.destroy();
    
    res.json({ 
      message: "About section deleted successfully",
      success: true
    });
  } catch (error: any) {
    console.error("Error deleting about:", error);
    res.status(400).json({ 
      message: "Failed to delete about section",
      error: error.message
    });
  }
};