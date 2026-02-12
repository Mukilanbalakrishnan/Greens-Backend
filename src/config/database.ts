import { Sequelize } from "sequelize-typescript";
import { User } from "../models/User.model";
import { Domain } from "../models/Domain.model";
import { Course } from "../models/Course.model";
import { Hero } from "../models/Hero.model";
import { EnrollCard } from "../models/EnrollCard.model";
import { EnrollmentRequest } from "../models/EnrollmentRequest.model";
import { FAQChat } from "../models/FaqChat.model";
import { About } from "../models/About.model";
import { TrainerAbout } from "../models/TrainerAbout.model";
import { CareerImpact } from "../models/CareerImpact.model";
import { Certificate } from "../models/Certificate.model";
import { Testimonial } from "../models/Testimonial.model";
import { StudyMaterial } from "../models/StudyMaterial.model";
import { StudentSuccess } from "../models/StudentSuccess.model";
import { Module } from "../models/Module.model"
import { ModuleTopic } from "../models/ModuleTopic.model";
import { Project } from "../models/Project.model";
import { ProjectTech } from "../models/ProjectTech.model";
import { VideoTestimonial } from "../models/VideoTestimonial.model";
import { TechStack } from "../models/TechStack.model";
import { Admin } from "../models/admin.model";
import { Contact } from "../models/mail.model"
import { YouTube_Shorts_videos } from "../models/youtubeshort.model"
export const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },

  models: [
    User,
    Hero,
    Domain,
    Course,
    EnrollCard,
    EnrollmentRequest,
    FAQChat,
    About,
    TrainerAbout,
    CareerImpact,
    Certificate,
    Testimonial,
    StudyMaterial,
    StudentSuccess,
    ModuleTopic,
    Module,
    Project,
    YouTube_Shorts_videos,
    ProjectTech,
    VideoTestimonial,
    TechStack,
    Admin,
    Contact
  ],

  logging: false,
});
