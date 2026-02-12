import { Request, Response } from "express";
import { TrainerAbout } from "../models/TrainerAbout.model";
import fs from "fs";
import path from "path";

export const getTrainerAbout = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId) || 0;
    const courseId = Number(req.query.courseId) || 0;

    // STEP 1: Try Specific Match (e.g., Domain 2, Course 1)
    let data = await TrainerAbout.findOne({
      where: { domainId, courseId, isActive: true },
    });

    // STEP 2: Fallback to Domain Level (e.g., Domain 2, Course 0)
    if (!data && courseId !== 0) {
      data = await TrainerAbout.findOne({
        where: { domainId, courseId: 0, isActive: true },
      });
    }

    // STEP 3: Absolute Fallback to Landing Page (Domain 0, Course 0)
    if (!data && (domainId !== 0 || courseId !== 0)) {
      data = await TrainerAbout.findOne({
        where: { domainId: 0, courseId: 0, isActive: true },
      });
    }

    if (!data) {
      return res.status(404).json({ message: "No trainer info found" });
    }

    return res.json(data);
  } catch (error: any) {
    console.error("TRAINER ABOUT API ERROR:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

/* ---------- ADMIN: Get ALL trainer about sections ---------- */
export const getAllTrainerAboutsForAdmin = async (_req: Request, res: Response) => {
  try {
    const trainerAbouts = await TrainerAbout.findAll({
      order: [["id", "ASC"]] // Only id ordering
    });
   
    res.json(trainerAbouts);
  } catch (error: any) {
    console.error("Error fetching all trainer abouts:", error);
    res.status(500).json({ 
      message: "Failed to fetch all trainer about sections",
      error: error.message 
    });
  }
};

/* ---------- GET TRAINER ABOUT BY ID ---------- */
export const getTrainerAboutById = async (req: Request, res: Response) => {
  try {
    const trainerAbout = await TrainerAbout.findByPk(req.params.id);
    if (!trainerAbout) {
      return res.status(404).json({ message: "Trainer About section not found" });
    }
    res.json(trainerAbout);
  } catch (error: any) {
    console.error("Error fetching trainer about by ID:", error);
    res.status(500).json({ 
      message: "Failed to fetch trainer about section",
      error: error.message 
    });
  }
};

export const createTrainerAbout = async (req: Request, res: Response) => {
  try {
    const files = req.files as { mainImage?: Express.Multer.File[] };
    const imagePath = files?.mainImage?.[0] ? `/uploads/trainer-about/${files.mainImage[0].filename}` : null;

    // Parse socialLinks if it's sent as a stringified JSON from FormData
    let socialLinks = [];
    if (req.body.socialLinks) {
      socialLinks = typeof req.body.socialLinks === 'string' 
        ? JSON.parse(req.body.socialLinks) 
        : req.body.socialLinks;
    }

    const trainer = await TrainerAbout.create({
      ...req.body,
      mainImage: imagePath,
      socialLinks: socialLinks
    });

    res.status(201).json(trainer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTrainerAbout = async (req: Request, res: Response) => {
  try {
    const trainer = await TrainerAbout.findByPk(req.params.id);
    if (!trainer) return res.status(404).json({ message: "Not found" });

    const files = req.files as { mainImage?: Express.Multer.File[] };
    let imagePath = trainer.mainImage;

    if (files?.mainImage?.[0]) {
      imagePath = `/uploads/trainer-about/${files.mainImage[0].filename}`;
    }

    let socialLinks = trainer.socialLinks;
    if (req.body.socialLinks) {
      socialLinks = typeof req.body.socialLinks === 'string' 
        ? JSON.parse(req.body.socialLinks) 
        : req.body.socialLinks;
    }

    await trainer.update({
      ...req.body,
      mainImage: imagePath,
      socialLinks: socialLinks
    });

    res.json(trainer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------- DELETE TRAINER ABOUT PERMANENTLY ---------- */
export const deleteTrainerAbout = async (req: Request, res: Response) => {
  try {
    const trainerAbout = await TrainerAbout.findByPk(req.params.id);
    if (!trainerAbout) {
      return res.status(404).json({ message: "Trainer About section not found" });
    }

    // Correct image deletion: mainImage is a string, not an array
    if (trainerAbout.mainImage) {
      // Remove leading slash for local disk check
      const diskPath = trainerAbout.mainImage.startsWith('/') 
        ? trainerAbout.mainImage.substring(1) 
        : trainerAbout.mainImage;
        
      if (fs.existsSync(diskPath)) {
        fs.unlinkSync(diskPath);
      }
    }

    await trainerAbout.destroy();
    
    res.json({ 
      message: "Trainer Profile deleted successfully",
      success: true
    });
  } catch (error: any) {
    res.status(400).json({ 
      message: "Deletion failed",
      error: error.message
    });
  }
};
/* ---------- REMOVE THE updateSortOrder FUNCTION COMPLETELY ---------- */
// Delete this entire function