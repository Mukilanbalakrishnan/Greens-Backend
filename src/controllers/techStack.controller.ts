// controllers/techStack.controller.ts
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { TechStack } from "../models/TechStack.model";

/* ---------- PUBLIC: Get all active tech stack items ---------- */
export const getTechStack = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let items = await TechStack.findAll({
      where: { domainId, courseId, isActive: true },
      order: [["order", "ASC"]],
    });

    // fallback → domain level
    if (!items.length && courseId > 0) {
      items = await TechStack.findAll({
        where: { domainId, courseId: 0, isActive: true },
        order: [["order", "ASC"]],
      });
    }

    res.json(items);
  } catch (error: any) {
    console.error("TECH STACK FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch tech stack" });
  }
};

/* ---------- ADMIN: Get ALL tech stack items (including inactive) ---------- */
export const getAllTechStackForAdmin = async (_req: Request, res: Response) => {
  try {
    const items = await TechStack.findAll({
      order: [["order", "ASC"]],
    });
    res.json(items);
  } catch (error: any) {
    console.error("Error fetching all tech stack items:", error);
    res.status(500).json({ message: "Failed to fetch all tech stack items" });
  }
};

/* ---------- GET TECH STACK ITEM BY ID ---------- */
export const getTechStackById = async (req: Request, res: Response) => {
  try {
    const item = await TechStack.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Tech stack item not found" });
    }
    res.json(item);
  } catch (error: any) {
    console.error("Error fetching tech stack item by ID:", error);
    res.status(500).json({ message: "Failed to fetch tech stack item" });
  }
};

/* ---------- CREATE TECH STACK ITEM ---------- */
export const createTechStack = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Technology icon required" });
    }

    const tech = await TechStack.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      name: req.body.name,
      order: Number(req.body.order || 0),
      iconUrl: `/uploads/tech-stack/${req.file.filename}`,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    });

    res.status(201).json({
      message: "Tech stack item created successfully",
      tech
    });
  } catch (error: any) {
    console.error("TECH STACK CREATE ERROR:", error);
    res.status(400).json({ 
      message: "Tech stack item creation failed",
      error: error.message 
    });
  }
};

/* ---------- UPDATE TECH STACK ITEM ---------- */
export const updateTechStack = async (req: Request, res: Response) => {
  try {
    const tech = await TechStack.findByPk(req.params.id);
    if (!tech) {
      return res.status(404).json({ message: "Tech stack item not found" });
    }

    // Handle image update
    let updatedIconUrl = tech.iconUrl;
    
    if (req.file) {
      // Delete old image
      const oldFilename = tech.iconUrl.split('/').pop();
      if (oldFilename) {
        const oldPath = path.join('uploads/tech-stack', oldFilename);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updatedIconUrl = `/uploads/tech-stack/${req.file.filename}`;
    }

    await tech.update({
      domainId: req.body.domainId !== undefined ? Number(req.body.domainId) : tech.domainId,
      courseId: req.body.courseId !== undefined ? Number(req.body.courseId) : tech.courseId,
      name: req.body.name || tech.name,
      order: req.body.order !== undefined ? Number(req.body.order) : tech.order,
      iconUrl: updatedIconUrl,
      isActive: req.body.isActive !== undefined 
        ? (req.body.isActive === 'true' || req.body.isActive === true) 
        : tech.isActive,
    });

    const updatedTech = await TechStack.findByPk(req.params.id);
    
    res.json({
      message: "Tech stack item updated successfully",
      tech: updatedTech
    });
  } catch (error: any) {
    console.error("TECH STACK UPDATE ERROR:", error);
    res.status(400).json({ 
      message: "Tech stack item update failed",
      error: error.message 
    });
  }
};

/* ---------- DELETE TECH STACK ITEM PERMANENTLY ---------- */
export const deleteTechStack = async (req: Request, res: Response) => {
  try {
    const tech = await TechStack.findByPk(req.params.id);
    if (!tech) {
      return res.status(404).json({ message: "Tech stack item not found" });
    }

    // Delete icon from disk
    const filename = tech.iconUrl.split('/').pop();
    if (filename) {
      const filePath = path.join('uploads/tech-stack', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await tech.destroy();
    
    res.json({ 
      message: "Tech stack item deleted permanently",
      success: true
    });
  } catch (error: any) {
    console.error("TECH STACK DELETE ERROR:", error);
    res.status(400).json({ 
      message: "Tech stack item deletion failed",
      error: error.message
    });
  }
};