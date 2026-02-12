import { Request, Response } from "express";
import { EnrollCard } from "../models/EnrollCard.model";
import fs from 'fs';
import path from 'path';

/* ---------- GET (Frontend - with fallback) ---------- */
export const getEnrollCards = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let cards = await EnrollCard.findAll({
      where: { domainId, courseId, isActive: true },
      order: [["order", "ASC"]],
    });

    if (!cards.length && domainId > 0) {
      cards = await EnrollCard.findAll({
        where: { domainId, courseId: 0, isActive: true },
      });
    }

    if (!cards.length) {
      cards = await EnrollCard.findAll({
        where: { domainId: 0, courseId: 0, isActive: true },
      });
    }

    res.json(cards);
  } catch (error: any) {
    console.error("Error fetching enroll cards:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Error fetching enroll cards", 
      error: error.message 
    });
  }
};

/* ---------- GET (Admin - All Cards with Stats) ---------- */
export const getAllEnrollCardsForAdmin = async (req: Request, res: Response) => {
  try {
    const cards = await EnrollCard.findAll({
      order: [
        ['domainId', 'ASC'],
        ['order', 'ASC'],
      ],
    });

    // Calculate Stats
    const stats = {
      total: cards.length,
      active: cards.filter(c => c.isActive).length,
      inactive: cards.filter(c => !c.isActive).length
    };

    res.json({
      success: true,
      data: cards,
      stats: stats // Added stats here
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ---------- CREATE ---------- */
export const createEnrollCard = async (req: Request, res: Response) => {
  try {
    const image = req.file
      ? `/uploads/enroll-cards/${req.file.filename}`
      : "";

    // Validate required fields
    if (!req.body.title) {
      return res.status(400).json({ 
        success: false,
        message: "Title is required" 
      });
    }

    if (!image) {
      return res.status(400).json({ 
        success: false,
        message: "Image is required" 
      });
    }

    // Parse numeric fields
    const cardData = {
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      title: req.body.title,
      image: image,
      order: Number(req.body.order || 0),
      isActive: req.body.isActive === "true" || req.body.isActive === true || true,
    };

    const card = await EnrollCard.create(cardData);
    
    res.status(201).json({
      success: true,
      message: "Enroll card created successfully",
      data: card
    });
  } catch (error: any) {
    console.error("Error creating enroll card:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Error creating enroll card", 
      error: error.message 
    });
  }
};

/* ---------- UPDATE ---------- */
export const updateEnrollCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const card = await EnrollCard.findByPk(id);
    
    if (!card) {
      return res.status(404).json({ 
        success: false, 
        message: "Enroll card not found" 
      });
    }

    // Prepare update data
    const updateData: any = {};
    
    // Handle file upload
    if (req.file) {
      // Delete old image if it exists
      if (card.image && card.image !== '') {
        const oldImagePath = path.join(process.cwd(), 'public', card.image);
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      updateData.image = `/uploads/enroll-cards/${req.file.filename}`;
    }

    // Handle image removal request
    if (req.body.removeImage === 'true' || req.body.removeImage === true) {
      if (card.image && card.image !== '') {
        const oldImagePath = path.join(process.cwd(), 'public', card.image);
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error("Error deleting image:", err);
        }
      }
      updateData.image = '';
    }

    // Update other fields
    if (req.body.domainId !== undefined) updateData.domainId = parseInt(req.body.domainId);
    if (req.body.courseId !== undefined) updateData.courseId = parseInt(req.body.courseId);
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.order !== undefined) updateData.order = parseInt(req.body.order);
    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive === "true" || req.body.isActive === true;
    }

    await card.update(updateData);
    
    // Fetch the updated card
    const updatedCard = await EnrollCard.findByPk(id);
    
    res.json({
      success: true,
      message: "Enroll card updated successfully",
      data: updatedCard
    });
    
  } catch (error: any) {
    console.error("Error updating enroll card:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Error updating enroll card", 
      error: error.message 
    });
  }
};

/* ---------- DELETE (SOFT) ---------- */
export const deleteEnrollCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const card = await EnrollCard.findByPk(id);
    
    if (!card) return res.status(404).json({ success: false, message: "Not found" });

    // Instead of destroying, we only deactivate
    await card.update({ isActive: false });

    res.json({ 
      success: true,
      message: "Card deactivated (Soft Delete)"
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
/* ---------- HARD DELETE ---------- */
export const hardDeleteEnrollCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const card = await EnrollCard.findByPk(id);
    
    if (!card) {
      return res.status(404).json({ 
        success: false, 
        message: "Enroll card not found" 
      });
    }

    // Delete image file if exists
    if (card.image && card.image !== '') {
      const imagePath = path.join(process.cwd(), 'public', card.image);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.error("Error deleting image file:", err);
      }
    }

    // Hard delete from database
    await card.destroy();

    res.json({ 
      success: true,
      message: "Enroll card permanently deleted"
    });
    
  } catch (error: any) {
    console.error("Error hard deleting enroll card:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Error deleting enroll card", 
      error: error.message 
    });
  }
};

/* ---------- RESTORE ---------- */
export const restoreEnrollCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const card = await EnrollCard.findByPk(id);
    
    if (!card) {
      return res.status(404).json({ 
        success: false, 
        message: "Enroll card not found" 
      });
    }

    // Restore by setting isActive to true
    await card.update({ isActive: true });

    res.json({ 
      success: true,
      message: "Enroll card restored successfully",
      data: card
    });
    
  } catch (error: any) {
    console.error("Error restoring enroll card:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Error restoring enroll card", 
      error: error.message 
    });
  }
};