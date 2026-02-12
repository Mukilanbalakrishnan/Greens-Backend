// controllers/careerImpact.controller.ts
import { Request, Response } from "express";
import { CareerImpact } from "../models/CareerImpact.model";

/* ---------- PUBLIC: Get career impact for domain/course ---------- */
export const getCareerImpact = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let impact = await CareerImpact.findOne({
      where: { domainId, courseId, isActive: true },
    });

    // fallback → domain level
    if (!impact && domainId > 0 && courseId > 0) {
      impact = await CareerImpact.findOne({
        where: { domainId, courseId: 0, isActive: true },
      });
    }

    // fallback → landing page
    if (!impact) {
      impact = await CareerImpact.findOne({
        where: { domainId: 0, courseId: 0, isActive: true },
      });
    }

    if (!impact) {
      return res.status(404).json({ message: "Career impact not found" });
    }

    res.json(impact);
  } catch (error: any) {
    console.error("CAREER IMPACT FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch career impact" });
  }
};

/* ---------- ADMIN: Get ALL career impacts (including inactive) ---------- */
export const getAllCareerImpactsForAdmin = async (_req: Request, res: Response) => {
  try {
    const impacts = await CareerImpact.findAll({
      order: [["id", "ASC"]],
    });
    res.json(impacts);
  } catch (error: any) {
    console.error("Error fetching all career impacts:", error);
    res.status(500).json({ message: "Failed to fetch all career impacts" });
  }
};

/* ---------- GET CAREER IMPACT BY ID ---------- */
export const getCareerImpactById = async (req: Request, res: Response) => {
  try {
    const impact = await CareerImpact.findByPk(req.params.id);
    if (!impact) {
      return res.status(404).json({ message: "Career impact not found" });
    }
    res.json(impact);
  } catch (error: any) {
    console.error("Error fetching career impact by ID:", error);
    res.status(500).json({ message: "Failed to fetch career impact" });
  }
};

/* ---------- CREATE CAREER IMPACT ---------- */
export const createCareerImpact = async (req: Request, res: Response) => {
  try {
    const impact = await CareerImpact.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      mainTitle: req.body.mainTitle,
      mainDescription: req.body.mainDescription,
      ctaText: req.body.ctaText,
      ctaLink: req.body.ctaLink,
      card1Title: req.body.card1Title,
      card1Description: req.body.card1Description,
      card2Title: req.body.card2Title,
      card2Description: req.body.card2Description,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    });

    res.status(201).json({
      message: "Career impact created successfully",
      impact
    });
  } catch (error: any) {
    console.error("CAREER IMPACT CREATE ERROR:", error);
    res.status(400).json({ 
      message: "Career impact creation failed",
      error: error.message 
    });
  }
};

/* ---------- UPDATE CAREER IMPACT ---------- */
export const updateCareerImpact = async (req: Request, res: Response) => {
  try {
    const impact = await CareerImpact.findByPk(req.params.id);
    if (!impact) {
      return res.status(404).json({ message: "Career impact not found" });
    }

    await impact.update({
      domainId: req.body.domainId !== undefined ? Number(req.body.domainId) : impact.domainId,
      courseId: req.body.courseId !== undefined ? Number(req.body.courseId) : impact.courseId,
      mainTitle: req.body.mainTitle || impact.mainTitle,
      mainDescription: req.body.mainDescription !== undefined ? req.body.mainDescription : impact.mainDescription,
      ctaText: req.body.ctaText || impact.ctaText,
      ctaLink: req.body.ctaLink || impact.ctaLink,
      card1Title: req.body.card1Title || impact.card1Title,
      card1Description: req.body.card1Description !== undefined ? req.body.card1Description : impact.card1Description,
      card2Title: req.body.card2Title || impact.card2Title,
      card2Description: req.body.card2Description !== undefined ? req.body.card2Description : impact.card2Description,
      isActive: req.body.isActive !== undefined 
        ? (req.body.isActive === 'true' || req.body.isActive === true) 
        : impact.isActive,
    });

    const updatedImpact = await CareerImpact.findByPk(req.params.id);
    
    res.json({
      message: "Career impact updated successfully",
      impact: updatedImpact
    });
  } catch (error: any) {
    console.error("CAREER IMPACT UPDATE ERROR:", error);
    res.status(400).json({ 
      message: "Career impact update failed",
      error: error.message 
    });
  }
};

/* ---------- DELETE CAREER IMPACT PERMANENTLY ---------- */
export const deleteCareerImpact = async (req: Request, res: Response) => {
  try {
    const impact = await CareerImpact.findByPk(req.params.id);
    if (!impact) {
      return res.status(404).json({ message: "Career impact not found" });
    }

    await impact.destroy();
    
    res.json({ 
      message: "Career impact deleted permanently",
      success: true
    });
  } catch (error: any) {
    console.error("CAREER IMPACT DELETE ERROR:", error);
    res.status(400).json({ 
      message: "Career impact deletion failed",
      error: error.message
    });
  }
};