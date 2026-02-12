import { Request, Response } from "express";
import { Hero } from "../models/Hero.model";
import path from "path";
import fs from "fs";

// Define types for uploaded files
interface UploadedFile {
  filename: string;
  path: string;
  originalname: string;
  mimetype: string;
  size: number;
}

// Type guard for files array
function isFileArray(files: any): files is UploadedFile[] {
  return Array.isArray(files);
}

// Helper function to get files safely
function getFiles(req: Request): UploadedFile[] {
  if (!req.files) return [];
  if (Array.isArray(req.files)) {
    return req.files as UploadedFile[];
  }
  return [];
}

/* ---------- GET (Frontend) ---------- */
export const getHeroData = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    console.log("domainId:", domainId, "courseId:", courseId);


    let hero = await Hero.findOne({
      where: { domainId, courseId, isActive: true },
    });

    if (!hero && domainId > 0 && courseId > 0) {
      hero = await Hero.findOne({
        where: { domainId, courseId: 0, isActive: true },
      });
    }

    if (!hero) {
      hero = await Hero.findOne({
        where: { domainId: 0, courseId: 0, isActive: true },
      });
    }

    if (!hero) {
      return res.status(404).json({ message: "Hero data not found" });
    }

    res.json(hero);
  } catch (error) {
    console.error("Error in getHeroData:", error);
    res.status(500).json({ message: "Failed to fetch hero data" });
  }
};

/* ---------- ADMIN: Get all heroes ---------- */
export const getAllHeroesForAdmin = async (req: Request, res: Response) => {
  try {
    const heroes = await Hero.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(heroes);
  } catch (error) {
    console.error("Error fetching all heroes:", error);
    res.status(500).json({ message: "Failed to fetch all heroes" });
  }
};

/* ---------- ADMIN: Get hero by ID ---------- */
export const getHeroByIdForAdmin = async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findByPk(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }
    res.json(hero);
  } catch (error) {
    console.error("Error fetching hero by ID:", error);
    res.status(500).json({ message: "Failed to fetch hero" });
  }
};

/* ---------- ADMIN: Create hero ---------- */
export const createHero = async (req: Request, res: Response) => {
  try {
    const files = getFiles(req);
    
    if (files.length === 0) {
      return res.status(400).json({ message: "At least one hero image is required" });
    }

    const imageUrls = files.map(
      (file: UploadedFile) => `/uploads/heroes/${file.filename}`
    );

    const heroData = {
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      title: req.body.title,
      subtitle: req.body.subtitle,
      description: req.body.description || '',

      images: imageUrls,
      runningTexts: req.body.runningTexts ? JSON.parse(req.body.runningTexts) : [],
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    };

    const hero = await Hero.create(heroData);

    res.status(201).json({
      message: "Hero created successfully",
      hero
    });
  } catch (error: any) {
    console.error("Error creating hero:", error);
    res.status(400).json({
      message: "Failed to create hero",
      error: error.message,
    });
  }
};

/* ---------- ADMIN: Update hero ---------- */
export const updateHero = async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findByPk(req.params.id);
    if (!hero) return res.status(404).json({ message: "Hero not found" });

    const files = getFiles(req);
    
    // 1. Parse the images the user wants to KEEP
    let keptExistingImages: string[] = [];
    if (req.body.existingImages) {
      keptExistingImages = JSON.parse(req.body.existingImages);
    } else {
      // If the field is missing, assume the user deleted ALL previous images
      keptExistingImages = [];
    }

    // 2. Identify and Delete files from the physical server that are NOT in the kept list
    const imagesToDelete = hero.images.filter(img => !keptExistingImages.includes(img));
    
    imagesToDelete.forEach(imgPath => {
      const filePath = path.join(process.cwd(), imgPath); // Use absolute path
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // 3. Process new uploads
    const newImageUrls = files.map(file => `/uploads/heroes/${file.filename}`);

    // 4. Combine: Kept Old Images + Brand New Images (Appended to the end)
    const finalImagesArray = [...keptExistingImages, ...newImageUrls];

    // 5. Update the Record
    const heroData = {
      title: req.body.title || hero.title,
      subtitle: req.body.subtitle || hero.subtitle,
      description: req.body.description || hero.description,

      domainId: Number(req.body.domainId),
      courseId: Number(req.body.courseId),
      images: finalImagesArray, // This saves the cleaned array to DB
      runningTexts: req.body.runningTexts ? JSON.parse(req.body.runningTexts) : hero.runningTexts,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    };

    await hero.update(heroData);

    res.json({
      message: "Hero updated and images synced successfully",
      hero
    });
  } catch (error: any) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
};

/* ---------- ADMIN: Delete hero ---------- */
export const deleteHero = async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findByPk(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    // Delete associated images
    if (hero.images && hero.images.length > 0) {
      hero.images.forEach(imgPath => {
        const filename = imgPath.split('/').pop();
        if (filename) {
          const filePath = path.join('uploads/heroes', filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
    }

    await hero.destroy();
    
    res.json({ 
      message: "Hero deleted successfully",
      success: true
    });
  } catch (error: any) {
    console.error("Error deleting hero:", error);
    res.status(400).json({ 
      message: "Failed to delete hero",
      error: error.message
    });
  }
};