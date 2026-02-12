import { Router } from "express";
import heroRoutes from "./hero.routes";
import domainRoutes from "./domain.routes";
import faqChatRoutes from "./faq.routes"
import enrollmentRequestRoutes from "./enrollmentRequest.routes"
import enrollCardRoutes from "./enrollCard.routes";
import aboutRoutes from "./about.routes";
import trainerAboutRoutes from "./trainerAbout.routes";
import careerImpactRoutes from "./careerImpact.routes";
import certificateRoutes from "./certificate.routes";
import courseRoutes from "./course.routes";
import testimonialRoutes from "./testimonial.routes";
import studyMaterial from "./studyMaterial.routes"
import Success from "./studentSuccess.routes";
import Module from "./module.routes"
import projectRoutes from "./project.routes";
import videoRoutes from "./videoTestimonial.routes";
import techStackRoutes from "./techStack.routes";
import adminRoutes from "./admin.routes";
import notice from "./notice.routes";
import mail from "./mail.routes"
import youtubeshort from "./youtubeshort.route"
const router = Router();


router.use("/hero", heroRoutes);
router.use("/domain", domainRoutes);
router.use("/enroll-cards", enrollCardRoutes);
router.use("/enrollments", enrollmentRequestRoutes);
router.use("/faq-chat", faqChatRoutes);
router.use("/about", aboutRoutes);
router.use("/trainer-about", trainerAboutRoutes);
router.use("/career-impact", careerImpactRoutes);
router.use("/certificate",certificateRoutes);
router.use("/courses", courseRoutes);
router.use("/testimonials", testimonialRoutes); 
router.use("/materials",studyMaterial);   
router.use("/student-success",Success);
router.use("/modules",Module);
router.use("/projects", projectRoutes);
router.use("/videos", videoRoutes);
router.use("/tech-stack", techStackRoutes);
router.use("/admin", adminRoutes);
router.use("/notices", notice);
router.use("/mail",mail)
router.use("/youtube-short",youtubeshort)
export default router;
