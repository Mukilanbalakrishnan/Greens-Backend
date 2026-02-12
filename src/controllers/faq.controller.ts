import { Request, Response } from "express";
import { FAQChat } from "../models/FaqChat.model";

/* ----------------------------------------
   CHATBOT: GET FAQs BY STEP
----------------------------------------- */
export const getFaqByStep = async (req: Request, res: Response) => {
  try {
    const step = Number(req.query.step || 0);

    const faqs = await FAQChat.findAll({
      where: { step, isActive: true },
      order: [["id", "ASC"]],
      attributes: ["id", "question", "answer"],
    });

    res.json(faqs);
  } catch (error) {
    console.error("FAQ Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
};

/* ----------------------------------------
   ADMIN: CREATE FAQ USING ARRAYS
----------------------------------------- */
export const createFaqBulk = async (req: Request, res: Response) => {
  try {
    const { step, questions, answers } = req.body;

    if (
      step === undefined ||
      !Array.isArray(questions) ||
      !Array.isArray(answers)
    ) {
      return res.status(400).json({
        message: "step, questions[], and answers[] are required",
      });
    }

    if (questions.length !== answers.length) {
      return res.status(400).json({
        message: "Questions and answers length mismatch",
      });
    }

    const faqData = questions.map((question: string, index: number) => ({
      step: Number(step),
      question,
      answer: answers[index],
      isActive: true,
    }));

    const createdFaqs = await FAQChat.bulkCreate(faqData);

    res.status(201).json({
      success: true,
      count: createdFaqs.length,
      faqs: createdFaqs,
    });
  } catch (error) {
    console.error("Create FAQ Bulk Error:", error);
    res.status(500).json({ message: "Failed to create FAQs" });
  }
};

/* ----------------------------------------
   ADMIN: GET ALL FAQs
----------------------------------------- */
export const getAllFaqs = async (_req: Request, res: Response) => {
  try {
    const faqs = await FAQChat.findAll({
      order: [["step", "ASC"], ["id", "ASC"]],
    });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
};

/* ----------------------------------------
   ADMIN: UPDATE SINGLE FAQ
----------------------------------------- */
export const updateFaq = async (req: Request, res: Response) => {
  try {
    const faq = await FAQChat.findByPk(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    await faq.update({
      step: req.body.step ?? faq.step,
      question: req.body.question ?? faq.question,
      answer: req.body.answer ?? faq.answer,
      isActive:
        req.body.isActive !== undefined
          ? req.body.isActive === true || req.body.isActive === "true"
          : faq.isActive,
    });

    res.json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ message: "Failed to update FAQ" });
  }
};

/* ----------------------------------------
   ADMIN: SOFT DELETE FAQ
----------------------------------------- */
export const deleteFaq = async (req: Request, res: Response) => {
  try {
    const faq = await FAQChat.findByPk(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    await faq.update({ isActive: false });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete FAQ" });
  }
};
