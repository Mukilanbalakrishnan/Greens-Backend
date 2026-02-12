import { Request, Response } from "express";
import { StudentSuccess } from "../models/StudentSuccess.model";
import fs from "fs";
import path from "path";

/* ---------- PUBLIC: Get all active student success stories ---------- */
export const getStudentSuccess = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    const where: any = { isActive: true };

    if (domainId > 0) where.domainId = domainId;
    if (courseId > 0) where.courseId = courseId;

    const data = await StudentSuccess.findAll({
      where,
      order: [["id", "ASC"]] // Simple ordering
    });

    res.json(data);
  } catch (error: any) {
    console.error("STUDENT SUCCESS FETCH ERROR:", error);
    res.status(500).json({ 
      message: "Failed to fetch student success stories",
      error: error.message 
    });
  }
};

/* ---------- ADMIN: Get ALL student success (including inactive) ---------- */
export const getAllStudentSuccessForAdmin = async (_req: Request, res: Response) => {
  try {
    const students = await StudentSuccess.findAll({
      order: [["id", "ASC"]] // Simple ordering
    });
    res.json(students);
  } catch (error: any) {
    console.error("Error fetching all student success:", error);
    res.status(500).json({ 
      message: "Failed to fetch all student success stories",
      error: error.message 
    });
  }
};

/* ---------- GET STUDENT SUCCESS BY ID ---------- */
export const getStudentSuccessById = async (req: Request, res: Response) => {
  try {
    const student = await StudentSuccess.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student success story not found" });
    }
    res.json(student);
  } catch (error: any) {
    console.error("Error fetching student success by ID:", error);
    res.status(500).json({ 
      message: "Failed to fetch student success story",
      error: error.message 
    });
  }
};

/* ---------- CREATE STUDENT SUCCESS ---------- */
export const createStudentSuccess = async (req: Request, res: Response) => {
  try {
    const imagePath = req.file
      ? `/uploads/student-success/${req.file.filename}`
      : null;

    const student = await StudentSuccess.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      name: req.body.name,
      course: req.body.course,
      rating: Number(req.body.rating),
      review: req.body.review,
      placement: req.body.placement || "",
      duration: req.body.duration || "",
      image: imagePath,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
      
    });

    res.status(201).json({
      message: "Student success story created successfully",
      student
    });
  } catch (error: any) {
    console.error("STUDENT SUCCESS CREATE ERROR:", error);
    
    // Clean up uploaded file if creation fails
    if (req.file) {
      const filePath = path.join("uploads", "student-success", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(400).json({ 
      message: "Student success story creation failed",
      error: error.message 
    });
  }
};

/* ---------- UPDATE STUDENT SUCCESS ---------- */
export const updateStudentSuccess = async (req: Request, res: Response) => {
  try {
    const student = await StudentSuccess.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student success story not found" });
    }

    let newImagePath = student.image;
    let oldImageToDelete: string | null = null;

    // Handle image update
    if (req.file) {
      newImagePath = `/uploads/student-success/${req.file.filename}`;
      
      // Mark old image for deletion
      if (student.image) {
        oldImageToDelete = student.image.replace("/uploads/", "uploads/");
      }
    }

    // Update student record
    await student.update({
      domainId: req.body.domainId !== undefined ? Number(req.body.domainId) : student.domainId,
      courseId: req.body.courseId !== undefined ? Number(req.body.courseId) : student.courseId,
      name: req.body.name || student.name,
      course: req.body.course || student.course,
      rating: req.body.rating !== undefined ? Number(req.body.rating) : student.rating,
      review: req.body.review !== undefined ? req.body.review : student.review,
      placement: req.body.placement !== undefined ? req.body.placement : student.placement,
      duration: req.body.duration !== undefined ? req.body.duration : student.duration,
      image: newImagePath,
      isActive: req.body.isActive !== undefined 
        ? (req.body.isActive === 'true' || req.body.isActive === true) 
        : student.isActive,
      
    });

    // Delete old image if new one was uploaded
    if (oldImageToDelete && fs.existsSync(oldImageToDelete)) {
      fs.unlinkSync(oldImageToDelete);
    }

    const updatedStudent = await StudentSuccess.findByPk(req.params.id);
    
    res.json({
      message: "Student success story updated successfully",
      student: updatedStudent
    });
  } catch (error: any) {
    console.error("STUDENT SUCCESS UPDATE ERROR:", error);
    
    // Clean up uploaded file if update fails
    if (req.file) {
      const filePath = path.join("uploads", "student-success", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(400).json({ 
      message: "Student success story update failed",
      error: error.message 
    });
  }
};

/* ---------- DELETE STUDENT SUCCESS PERMANENTLY ---------- */
export const deleteStudentSuccess = async (req: Request, res: Response) => {
  try {
    const student = await StudentSuccess.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student success story not found" });
    }

    // Delete image from disk
    if (student.image) {
      const diskPath = student.image.replace("/uploads/", "uploads/");
      if (fs.existsSync(diskPath)) {
        fs.unlinkSync(diskPath);
      }
    }

    await student.destroy();
    
    res.json({ 
      message: "Student success story deleted permanently",
      success: true
    });
  } catch (error: any) {
    console.error("STUDENT SUCCESS DELETE ERROR:", error);
    res.status(400).json({ 
      message: "Student success story deletion failed",
      error: error.message
    });
  }
};

/* ---------- UPDATE SORT ORDER (BULK) ---------- */
export const updateSortOrder = async (req: Request, res: Response) => {
  try {
    const { updates } = req.body; // [{id: 1, sortOrder: 0}, {id: 2, sortOrder: 1}]
    
    if (!Array.isArray(updates)) {
      return res.status(400).json({ message: "Invalid updates array" });
    }

    const updatePromises = updates.map(({ id, sortOrder }: { id: number; sortOrder: number }) =>
      StudentSuccess.update({ sortOrder }, { where: { id } })
    );

    await Promise.all(updatePromises);
    
    res.json({ 
      message: "Sort order updated successfully",
      success: true
    });
  } catch (error: any) {
    console.error("SORT ORDER UPDATE ERROR:", error);
    res.status(400).json({ 
      message: "Failed to update sort order",
      error: error.message
    });
  }
};