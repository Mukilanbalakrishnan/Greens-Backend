// controllers/certificate.controller.ts
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Certificate } from "../models/Certificate.model";

/* ---------- PUBLIC: Get certificate for domain/course ---------- */
export const getCertificate = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let certificate = await Certificate.findOne({
      where: { domainId, courseId, isActive: true },
    });

    // fallback → domain level
    if (!certificate && domainId > 0 && courseId > 0) {
      certificate = await Certificate.findOne({
        where: { domainId, courseId: 0, isActive: true },
      });
    }

    // fallback → landing page
    if (!certificate) {
      certificate = await Certificate.findOne({
        where: { domainId: 0, courseId: 0, isActive: true },
      });
    }

    if (!certificate) {
      return res.status(404).json({ message: "Certificate data not found" });
    }

    res.json(certificate);
  } catch (error: any) {
    console.error("CERTIFICATE FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch certificate data" });
  }
};

/* ---------- ADMIN: Get ALL certificates (including inactive) ---------- */
export const getAllCertificatesForAdmin = async (_req: Request, res: Response) => {
  try {
    const certificates = await Certificate.findAll({
      order: [["id", "ASC"]],
    });
    res.json(certificates);
  } catch (error: any) {
    console.error("Error fetching all certificates:", error);
    res.status(500).json({ message: "Failed to fetch all certificates" });
  }
};

/* ---------- GET CERTIFICATE BY ID ---------- */
export const getCertificateById = async (req: Request, res: Response) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.json(certificate);
  } catch (error: any) {
    console.error("Error fetching certificate by ID:", error);
    res.status(500).json({ message: "Failed to fetch certificate" });
  }
};

/* ---------- CREATE CERTIFICATE ---------- */
export const createCertificate = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Certificate image required" });
    }

    const certificate = await Certificate.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      sectionTitle: req.body.sectionTitle,
      steps: JSON.parse(req.body.steps || '[]'),
      certificateImage: `/uploads/certificates/${req.file.filename}`,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    });

    res.status(201).json({
      message: "Certificate created successfully",
      certificate
    });
  } catch (error: any) {
    console.error("CERTIFICATE CREATE ERROR:", error);
    res.status(400).json({ 
      message: "Certificate creation failed",
      error: error.message 
    });
  }
};

/* ---------- UPDATE CERTIFICATE ---------- */
export const updateCertificate = async (req: Request, res: Response) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    let updatedImage = certificate.certificateImage;
    
    if (req.file) {
      // Delete old image
      const oldFilename = certificate.certificateImage.split('/').pop();
      if (oldFilename) {
        const oldPath = path.join('uploads/certificates', oldFilename);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updatedImage = `/uploads/certificates/${req.file.filename}`;
    }

    await certificate.update({
      domainId: req.body.domainId !== undefined ? Number(req.body.domainId) : certificate.domainId,
      courseId: req.body.courseId !== undefined ? Number(req.body.courseId) : certificate.courseId,
      sectionTitle: req.body.sectionTitle || certificate.sectionTitle,
      steps: req.body.steps ? JSON.parse(req.body.steps) : certificate.steps,
      certificateImage: updatedImage,
      isActive: req.body.isActive !== undefined 
        ? (req.body.isActive === 'true' || req.body.isActive === true) 
        : certificate.isActive,
    });

    const updatedCertificate = await Certificate.findByPk(req.params.id);
    
    res.json({
      message: "Certificate updated successfully",
      certificate: updatedCertificate
    });
  } catch (error: any) {
    console.error("CERTIFICATE UPDATE ERROR:", error);
    res.status(400).json({ 
      message: "Certificate update failed",
      error: error.message 
    });
  }
};

/* ---------- DELETE CERTIFICATE PERMANENTLY ---------- */
export const deleteCertificate = async (req: Request, res: Response) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // Delete image from disk
    const filename = certificate.certificateImage.split('/').pop();
    if (filename) {
      const filePath = path.join('uploads/certificates', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await certificate.destroy();
    
    res.json({ 
      message: "Certificate deleted permanently",
      success: true
    });
  } catch (error: any) {
    console.error("CERTIFICATE DELETE ERROR:", error);
    res.status(400).json({ 
      message: "Certificate deletion failed",
      error: error.message
    });
  }
};