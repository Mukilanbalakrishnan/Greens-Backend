import { Request, Response } from "express";
import { EnrollmentRequest } from "../models/EnrollmentRequest.model";
import { Domain } from "../models/Domain.model";
import { Course } from "../models/Course.model";
import { Contact } from "../models/mail.model";

/* ---------- CREATE (Frontend) ---------- */

export const createEnrollmentRequest = async (req: Request, res: Response) => {
  try {
    const { domainId, courseId, name, email, phone } = req.body;

    // 1. Validate domain
    const domainRecord = await Domain.findOne({
      where: { domainId: Number(domainId) },
    });

    if (!domainRecord) {
      return res.status(400).json({ success: false, message: "Invalid domain" });
    }

    // 2. Validate course
    let courseTitle: string | null = null;
    let finalCourseId: number | null = null;

    if (courseId && Number(courseId) !== 0) {
      const courseRecord = await Course.findOne({
        where: {
          id: Number(courseId),
          domainId: Number(domainId),
        },
      });

      if (courseRecord) {
        courseTitle = courseRecord.title;
        finalCourseId = courseRecord.id;
      }
    }

    // 3. Create enrollment request
    const enrollment = await EnrollmentRequest.create({
      domainId: domainRecord.domainId,
      domain: domainRecord.domain,
      courseId: finalCourseId,
      course: courseTitle,
      name,
      email,
      phone,
      status: "pending",
    });

    // 4. Create contact
await Contact.findOrCreate({
  where: {
    email,
    domainId: domainRecord.domainId,
    courseId: finalCourseId ?? 0,
  },
  defaults: {
    email,
    name,
    phone,
    domainId: domainRecord.domainId,
    courseId: finalCourseId ?? 0,
    contactType: courseTitle ?? "COURSE_ENQUIRY",
  },
});

    return res.status(201).json({
      success: true,
      message: "Enrollment submitted successfully",
      data: enrollment,
    });
  } catch (error: any) {
    console.error("Enrollment Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Enrollment failed",
    });
  }
};

/* ---------- GET ALL (Admin) ---------- */
export const getAllEnrollmentRequests = async (_req: Request, res: Response) => {
  try {
    const data = await EnrollmentRequest.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, data });
  } catch {
    return res.status(500).json({ success: false });
  }
};

/* ---------- DELETE ---------- */
export const deleteEnrollmentRequest = async (req: Request, res: Response) => {
  const deleted = await EnrollmentRequest.destroy({
    where: { id: req.params.id },
  });

  if (!deleted) {
    return res.status(404).json({ success: false });
  }

  return res.json({ success: true });
};
