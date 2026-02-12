// controllers/studyMaterial.controller.ts
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { StudyMaterial } from "../models/StudyMaterial.model";
import { Sequelize } from "sequelize";
const deleteFileFromDisk = (relativePath: string | null) => {
  if (!relativePath) return;
  const filename = relativePath.split('/').pop();
  if (filename) {
    const fullPath = path.join('uploads/study-materials', filename);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};
/* ---------- PUBLIC: Get all active study materials ---------- */
export const getStudyMaterials = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let where: any = { isActive: true };

    if (domainId > 0) where.domainId = domainId;
    if (courseId > 0) where.courseId = courseId;

    // Random ordering for landing page
    const order =
      domainId === 0 && courseId === 0
        ? Sequelize.literal("RAND()")
        : [["id", "ASC"]];

    const materials = await StudyMaterial.findAll({
      where,
      order: order as any,
    });

    res.json(materials);
  } catch (error: any) {
    console.error("STUDY MATERIAL FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch study materials" });
  }
};

/* ---------- ADMIN: Get ALL study materials (including inactive) ---------- */
export const getAllStudyMaterialsForAdmin = async (_req: Request, res: Response) => {
  try {
    const materials = await StudyMaterial.findAll({
      order: [["id", "ASC"]],
    });
    res.json(materials);
  } catch (error: any) {
    console.error("Error fetching all study materials:", error);
    res.status(500).json({ message: "Failed to fetch all study materials" });
  }
};

/* ---------- GET STUDY MATERIAL BY ID ---------- */
export const getStudyMaterialById = async (req: Request, res: Response) => {
  try {
    const material = await StudyMaterial.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Study material not found" });
    }
    res.json(material);
  } catch (error: any) {
    console.error("Error fetching study material by ID:", error);
    res.status(500).json({ message: "Failed to fetch study material" });
  }
};

/* ---------- CREATE STUDY MATERIAL ---------- */
export const createStudyMaterial = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const assetFile = files?.['file']?.[0];
    const imageFile = files?.['image']?.[0];

    if (!assetFile) {
      return res.status(400).json({ message: "Main asset file is required" });
    }

    const material = await StudyMaterial.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      fileName: req.body.fileName,
      description: req.body.description || '',
      fileType: req.body.fileType || 'PDF',
      highlight: req.body.highlight || '',
      filePath: `/uploads/study-materials/${assetFile.filename}`,
      imageUrl: imageFile ? `/uploads/study-materials/${imageFile.filename}` : null,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    });

    res.status(201).json({ message: "Study material created successfully", material });
  } catch (error: any) {
    res.status(400).json({ message: "Creation failed", error: error.message });
  }
};

/* ---------- UPDATE STUDY MATERIAL ---------- */
export const updateStudyMaterial = async (req: Request, res: Response) => {
  try {
    const material = await StudyMaterial.findByPk(req.params.id);
    if (!material) return res.status(404).json({ message: "Material not found" });

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const newAsset = files?.['file']?.[0];
    const newImage = files?.['image']?.[0];

    let updatedFilePath = material.filePath;
    let updatedImageUrl = material.imageUrl;

    // Handle Asset File Replacement
    if (newAsset) {
      deleteFileFromDisk(material.filePath);
      updatedFilePath = `/uploads/study-materials/${newAsset.filename}`;
    }

    // Handle Image Thumbnail Replacement
    if (newImage) {
      deleteFileFromDisk(material.imageUrl);
      updatedImageUrl = `/uploads/study-materials/${newImage.filename}`;
    }

    await material.update({
      domainId: req.body.domainId !== undefined ? Number(req.body.domainId) : material.domainId,
      courseId: req.body.courseId !== undefined ? Number(req.body.courseId) : material.courseId,
      fileName: req.body.fileName || material.fileName,
      description: req.body.description ?? material.description,
      fileType: req.body.fileType || material.fileType,
      highlight: req.body.highlight || material.highlight,
      filePath: updatedFilePath,
      imageUrl: updatedImageUrl,
      isActive: req.body.isActive !== undefined 
        ? (req.body.isActive === 'true' || req.body.isActive === true) 
        : material.isActive,
    });

    res.json({ message: "Updated successfully", material });
  } catch (error: any) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
};

/* ---------- DELETE STUDY MATERIAL ---------- */
export const deleteStudyMaterial = async (req: Request, res: Response) => {
  try {
    const material = await StudyMaterial.findByPk(req.params.id);
    if (!material) return res.status(404).json({ message: "Material not found" });

    // Clean up both files
    deleteFileFromDisk(material.filePath);
    deleteFileFromDisk(material.imageUrl);

    await material.destroy();
    res.json({ message: "Deleted successfully", success: true });
  } catch (error: any) {
    res.status(400).json({ message: "Deletion failed", error: error.message });
  }
};