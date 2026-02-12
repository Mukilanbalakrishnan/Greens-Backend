import { Request, Response } from "express";
import { Op } from "sequelize";
import { Contact } from "../models/mail.model";
import transporter from "../config/mail";
import { env } from "../config/env";
import fs from "fs";

export const handleMailActions = async (req: Request, res: Response) => {
  const body = req.body || {};
  const file = req.file;
  const {
    mode,
    email,
    name,
    phone,
    domainId,
    courseId,
    targetType,
    subject,
    message,
  } = body;

  try {
    /* ============================================================
       CLIENT – SUBSCRIBE (Footer or Course Form)
    ============================================================ */
    if (mode === "CLIENT_GENERAL" || mode === "CLIENT_COURSE") {
      await Contact.findOrCreate({
        where: { email, courseId: Number(courseId) || 0 },
        defaults: {
          email,
          name,
          phone,
          contactType: body.contactType || "GENERAL",
          domainId: Number(domainId) || 0,
          courseId: Number(courseId) || 0,
        },
      });
      return res.json({ success: true, message: "Subscribed successfully" });
    }

    /* ============================================================
       ADMIN – BULK / TARGETED MAIL
    ============================================================ */
    if (mode === "ADMIN_BULK") {
      let whereClause: any = {};

      // Build targeting logic
      if (targetType === "GENERAL") {
        whereClause = { contactType: "GENERAL" };
      } 
      else if (targetType === "DOMAIN_SPECIFIC") {
        whereClause = { domainId: Number(domainId) };
      } 
      else if (targetType === "COURSE_SPECIFIC") {
        whereClause = { 
          domainId: Number(domainId), 
          courseId: Number(courseId) 
        };
      } 
      else if (targetType === "ALL_COURSES") {
        whereClause = { courseId: { [Op.ne]: 0 } };
      }

      // 1. Fetch Recipients
      const users = await Contact.findAll({ where: whereClause });
      const bccList = [...new Set(users.map(u => u.email))];

      if (bccList.length === 0) {
        if (file) fs.unlinkSync(file.path);
        return res.status(404).json({ message: "No recipients found for this selection" });
      }

      // 2. Prepare Email and Send
      await transporter.sendMail({
        from: `"Greens Tech Admin" <${env.smtpFrom}>`,
        bcc: bccList, 
        subject: subject,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <div style="padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>`,
        attachments: file ? [{ filename: file.originalname, path: file.path }] : [],
      });

      if (file) fs.unlinkSync(file.path);
      return res.json({ success: true, sent: bccList.length });
    }

    return res.status(400).json({ message: "Invalid mode" });

  } catch (error: any) {
    if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};
/* =======================
   ADMIN – GET ALL
======================= */
export const getAllContacts = async (_req: Request, res: Response) => {
  try {
    const data = await Contact.findAll({ order: [["createdAt", "DESC"]] });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch" });
  }
};

/* =======================
   ADMIN – DELETE
======================= */
export const deleteContact = async (req: Request, res: Response) => {
  try {
    const deleted = await Contact.destroy({ where: { id: req.params.id } });
    return res.json({ success: !!deleted, message: deleted ? "Deleted" : "Not found" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error deleting" });
  }
};