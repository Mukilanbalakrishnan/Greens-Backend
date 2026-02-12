// controllers/videoTestimonial.controller.ts
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { VideoTestimonial } from "../models/VideoTestimonial.model";

/* ---------- PUBLIC: Get all active video testimonials ---------- */
export const getVideoTestimonials = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let testimonials = await VideoTestimonial.findAll({
      where: { domainId, courseId, isActive: true },
      order: [["order", "ASC"]],
    });

    // fallback → domain level
    if (!testimonials.length && courseId > 0) {
      testimonials = await VideoTestimonial.findAll({
        where: { domainId, courseId: 0, isActive: true },
        order: [["order", "ASC"]],
      });
    }

    res.json(testimonials);
  } catch (error: any) {
    console.error("VIDEO TESTIMONIAL FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch video testimonials" });
  }
};

/* ---------- ADMIN: Get ALL video testimonials (including inactive) ---------- */
export const getAllVideoTestimonialsForAdmin = async (_req: Request, res: Response) => {
  try {
    const testimonials = await VideoTestimonial.findAll({
      order: [["order", "ASC"]],
    });
    res.json(testimonials);
  } catch (error: any) {
    console.error("Error fetching all video testimonials:", error);
    res.status(500).json({ message: "Failed to fetch all video testimonials" });
  }
};

/* ---------- GET VIDEO TESTIMONIAL BY ID ---------- */
export const getVideoTestimonialById = async (req: Request, res: Response) => {
  try {
    const testimonial = await VideoTestimonial.findByPk(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Video testimonial not found" });
    }
    res.json(testimonial);
  } catch (error: any) {
    console.error("Error fetching video testimonial by ID:", error);
    res.status(500).json({ message: "Failed to fetch video testimonial" });
  }
};

/* ---------- CREATE VIDEO TESTIMONIAL ---------- */
export const createVideoTestimonial = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Video thumbnail required" });
    }

    const testimonial = await VideoTestimonial.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      name: req.body.name,
      batch: req.body.batch,
      quote: req.body.quote,
      videoUrl: req.body.videoUrl,
      order: Number(req.body.order || 0),
      imageUrl: `/uploads/video-thumbnails/${req.file.filename}`,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    });

    res.status(201).json({
      message: "Video testimonial created successfully",
      testimonial
    });
  } catch (error: any) {
    console.error("VIDEO TESTIMONIAL CREATE ERROR:", error);
    res.status(400).json({ 
      message: "Video testimonial creation failed",
      error: error.message 
    });
  }
};

/* ---------- UPDATE VIDEO TESTIMONIAL ---------- */
export const updateVideoTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await VideoTestimonial.findByPk(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Video testimonial not found" });
    }

    // Handle image update
    let updatedImageUrl = testimonial.imageUrl;
    
    if (req.file) {
      // Delete old image
      const oldFilename = testimonial.imageUrl.split('/').pop();
      if (oldFilename) {
        const oldPath = path.join('uploads/video-thumbnails', oldFilename);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updatedImageUrl = `/uploads/video-thumbnails/${req.file.filename}`;
    }

    await testimonial.update({
      domainId: req.body.domainId !== undefined ? Number(req.body.domainId) : testimonial.domainId,
      courseId: req.body.courseId !== undefined ? Number(req.body.courseId) : testimonial.courseId,
      name: req.body.name || testimonial.name,
      batch: req.body.batch || testimonial.batch,
      quote: req.body.quote || testimonial.quote,
      videoUrl: req.body.videoUrl || testimonial.videoUrl,
      order: req.body.order !== undefined ? Number(req.body.order) : testimonial.order,
      imageUrl: updatedImageUrl,
      isActive: req.body.isActive !== undefined 
        ? (req.body.isActive === 'true' || req.body.isActive === true) 
        : testimonial.isActive,
    });

    const updatedTestimonial = await VideoTestimonial.findByPk(req.params.id);
    
    res.json({
      message: "Video testimonial updated successfully",
      testimonial: updatedTestimonial
    });
  } catch (error: any) {
    console.error("VIDEO TESTIMONIAL UPDATE ERROR:", error);
    res.status(400).json({ 
      message: "Video testimonial update failed",
      error: error.message 
    });
  }
};

/* ---------- DELETE VIDEO TESTIMONIAL PERMANENTLY ---------- */
export const deleteVideoTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await VideoTestimonial.findByPk(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Video testimonial not found" });
    }

    // Delete thumbnail from disk
    const filename = testimonial.imageUrl.split('/').pop();
    if (filename) {
      const filePath = path.join('uploads/video-thumbnails', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await testimonial.destroy();
    
    res.json({ 
      message: "Video testimonial deleted permanently",
      success: true
    });
  } catch (error: any) {
    console.error("VIDEO TESTIMONIAL DELETE ERROR:", error);
    res.status(400).json({ 
      message: "Video testimonial deletion failed",
      error: error.message
    });
  }
};