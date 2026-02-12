// controllers/course.controller.ts
import { Request, Response } from "express";
import { Course } from "../models/Course.model";
import path from "path";
import fs from "fs";

/* ---------- PUBLIC: Get all active courses ---------- */
export const getCourses = async (req: Request, res: Response) => {
  try {
    const domainId = parseInt(req.query.domainId as string);

    // 1. Fetch courses for selected domain
    let courses = await Course.findAll({
      where: { 
        domainId: domainId, 
        isActive: true 
      },
      order: [["id", "ASC"]],
      logging: console.log // Logs the raw SQL to your terminal
    });

    // 2. Fallback to Domain 0 if none found
    if (courses.length === 0 && domainId !== 0) {
      
      courses = await Course.findAll({
        where: { domainId: 0, isActive: true },
        order: [["id", "ASC"]],
      });
    }

    res.json(courses);
  } catch (error: any) {
    console.error("Course API Error:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};
/* ---------- ADMIN: Get ALL courses (including inactive) ---------- */
export const getAllCoursesForAdmin = async (_req: Request, res: Response) => {
  try {
    const courses = await Course.findAll({
      order: [["id", "ASC"]],
    });
    res.json(courses);
  } catch (error: any) {
    console.error("Error fetching all courses:", error);
    res.status(500).json({ message: "Failed to fetch all courses" });
  }
};

/* ---------- CREATE COURSE (WITH IMAGE) ---------- */
export const createCourse = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Course image is required" });
    }

    const course = await Course.create({
      courseId: Number(req.body.courseId || 0), // Added mapping
      domainId: Number(req.body.domainId || 0),
      title: req.body.title,
      description: req.body.description,
      image: `/uploads/courses/${file.filename}`,
      price: req.body.price,
      duration: req.body.duration,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error: any) {
    res.status(400).json({ message: "Failed to create course", error: error.message });
  }
};

/* ---------- UPDATE COURSE ---------- */
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const file = req.file;
    let updatedImageUrl = course.image;
    
    if (file) {
      const oldFilename = course.image.split('/').pop();
      if (oldFilename) {
        const oldPath = path.join('uploads/courses', oldFilename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updatedImageUrl = `/uploads/courses/${file.filename}`;
    }

    await course.update({
      // Added courseId update logic
      courseId: req.body.courseId !== undefined ? Number(req.body.courseId) : course.courseId,
      domainId: req.body.domainId !== undefined ? Number(req.body.domainId) : course.domainId,
      title: req.body.title || course.title,
      description: req.body.description || course.description,
      image: updatedImageUrl,
      price: req.body.price || course.price,
      duration: req.body.duration || course.duration,
      isActive: req.body.isActive !== undefined 
        ? (req.body.isActive === 'true' || req.body.isActive === true) 
        : course.isActive,
    });

    const updatedCourse = await Course.findByPk(req.params.id);
    res.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error: any) {
    res.status(400).json({ message: "Failed to update course", error: error.message });
  }
};

/* ---------- DELETE COURSE PERMANENTLY ---------- */
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete associated image
    const filename = course.image.split('/').pop();
    if (filename) {
      const filePath = path.join('uploads/courses', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await course.destroy();
    
    res.json({ 
      message: "Course deleted permanently",
      success: true
    });
  } catch (error: any) {
    console.error("Error deleting course:", error);
    res.status(400).json({ 
      message: "Failed to delete course",
      error: error.message
    });
  }
};