import { Request, Response } from "express";
import  Notice  from "../models/Notice.model";

/**
 * @description Get all active notices (Used by the Marquee/Navbar)
 * @route GET /api/notices
 */
export const getActiveNotices = async (req: Request, res: Response): Promise<void> => {
  try {
    const notices = await Notice.findAll({
      where: { isActive: true },
      attributes: ['content'],
      order: [['createdAt', 'DESC']]
    });

    // Map to array of strings for the frontend marquee
    const noticeStrings = notices.map(n => n.content);
    res.status(200).json(noticeStrings);
  } catch (error: any) {
    console.error("Error fetching active notices:", error);
    res.status(500).json({ 
      message: "Error fetching active notices", 
      error: error.message 
    });
  }
};

/**
 * @description Get every notice (Active & Inactive) for Admin panel
 * @route GET /api/notices/admin
 */
export const getAllNotices = async (req: Request, res: Response): Promise<void> => {
  try {
    const notices = await Notice.findAll({ 
      order: [['createdAt', 'DESC']] 
    });
    res.status(200).json(notices);
  } catch (error: any) {
    console.error("Error fetching all notices:", error);
    res.status(500).json({ 
      message: "Error fetching all notices", 
      error: error.message 
    });
  }
};

/**
 * @description Create a new notice
 * @route POST /api/notices
 */
export const createNotice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, isActive } = req.body;
    
    if (!content || content.trim() === '') {
      res.status(400).json({ message: "Content is required" });
      return;
    }

    const newNotice = await Notice.create({ 
      content: content.trim(), 
      isActive: isActive === undefined ? true : isActive 
    });
    
    res.status(201).json({
      message: "Notice created successfully",
      notice: newNotice
    });
  } catch (error: any) {
    console.error("Error creating notice:", error);
    res.status(500).json({ 
      message: "Error creating notice", 
      error: error.message 
    });
  }
};

/**
 * @description Update an existing notice
 * @route PUT /api/notices/:id
 */
export const updateNotice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content, isActive } = req.body;

    const notice = await Notice.findByPk(id);

    if (!notice) {
      res.status(404).json({ message: "Notice not found" });
      return;
    }

    await notice.update({ 
      content: content !== undefined ? content.trim() : notice.content, 
      isActive: isActive !== undefined ? isActive : notice.isActive 
    });
    
    res.status(200).json({
      message: "Notice updated successfully",
      notice
    });
  } catch (error: any) {
    console.error("Error updating notice:", error);
    res.status(500).json({ 
      message: "Error updating notice", 
      error: error.message 
    });
  }
};

/**
 * @description Delete a notice
 * @route DELETE /api/notices/:id
 */
export const deleteNotice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const notice = await Notice.findByPk(id);

    if (!notice) {
      res.status(404).json({ message: "Notice not found" });
      return;
    }

    await notice.destroy();
    res.status(200).json({ 
      message: "Notice deleted successfully",
      success: true
    });
  } catch (error: any) {
    console.error("Error deleting notice:", error);
    res.status(500).json({ 
      message: "Error deleting notice", 
      error: error.message 
    });
  }
};