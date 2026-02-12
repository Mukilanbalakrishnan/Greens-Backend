import fs from "fs";
import path from "path";
import { YouTube_Shorts_videos } from "../models/youtubeshort.model";
import { Request,Response } from "express";
/* ---------- PUBLIC: Get active YouTube Shorts ---------- */
export const getYouTubeShortsVideos = async (req: Request, res: Response) => {
  try {
    const domainId = Number(req.query.domainId || 0);
    const courseId = Number(req.query.courseId || 0);

    let videos = await YouTube_Shorts_videos.findAll({
      where: { domainId, courseId, isActive: true },
      order: [["order", "ASC"]],
    });

    if (!videos.length && courseId > 0) {
      videos = await YouTube_Shorts_videos.findAll({
        where: { domainId, courseId: 0, isActive: true },
        order: [["order", "ASC"]],
      });
    }

    res.json(videos);
  } catch (error: any) {
    console.error("YOUTUBE SHORTS FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch YouTube Shorts videos" });
  }
};

/* ---------- ADMIN: Get all YouTube Shorts ---------- */
export const getAllYouTubeShortsVideosForAdmin = async (_req: Request, res: Response) => {
  try {
    const videos = await YouTube_Shorts_videos.findAll({
      order: [["order", "ASC"]],
    });
    res.json(videos);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch all YouTube Shorts videos" });
  }
};

/* ---------- GET BY ID ---------- */
export const getYouTubeShortsVideoById = async (req: Request, res: Response) => {
  const video = await YouTube_Shorts_videos.findByPk(req.params.id);
  if (!video) return res.status(404).json({ message: "Not found" });
  res.json(video);
};

/* ---------- CREATE ---------- */
export const createYouTubeShortsVideo = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Thumbnail required" });
    }

    const video = await YouTube_Shorts_videos.create({
      domainId: Number(req.body.domainId || 0),
      courseId: Number(req.body.courseId || 0),
      name: req.body.name,
      batch: req.body.batch,
      quote: req.body.quote,
      videoUrl: req.body.videoUrl,
      order: Number(req.body.order || 0),
      imageUrl: `/uploads/youtube-shorts-thumbnails/${req.file.filename}`,
      isActive: req.body.isActive === "true" || req.body.isActive === true,
    });

    res.status(201).json({ success: true, video });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ---------- UPDATE ---------- */
export const updateYouTubeShortsVideo = async (req: Request, res: Response) => {
  const video = await YouTube_Shorts_videos.findByPk(req.params.id);
  if (!video) return res.status(404).json({ message: "Not found" });

  let imageUrl = video.imageUrl;

  if (req.file) {
    const old = imageUrl.split("/").pop();
    if (old) {
      const p = path.join("uploads/youtube-shorts-thumbnails", old);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    imageUrl = `/uploads/youtube-shorts-thumbnails/${req.file.filename}`;
  }

  await video.update({
    ...req.body,
    domainId: Number(req.body.domainId),
    courseId: Number(req.body.courseId),
    order: Number(req.body.order),
    imageUrl,
    isActive: req.body.isActive === "true" || req.body.isActive === true,
  });

  res.json({ success: true, video });
};

/* ---------- DELETE ---------- */
export const deleteYouTubeShortsVideo = async (req: Request, res: Response) => {
  const video = await YouTube_Shorts_videos.findByPk(req.params.id);
  if (!video) return res.status(404).json({ message: "Not found" });

  const file = video.imageUrl.split("/").pop();
  if (file) {
    const p = path.join("uploads/youtube-shorts-thumbnails", file);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  await video.destroy();
  res.json({ success: true });
};
