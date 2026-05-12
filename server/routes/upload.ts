import express, { Request, Response } from "express";
import multer from "multer";
import { prisma } from "lib/prisma";
import { uploadBuffer } from "lib/gcs";

const router = express.Router();

const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/\s+/g, "_")
    .replace(/[^\w.-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed!"));
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 60 * 1024 * 1024,
  },
});

router.post(
  "/video",
  upload.single("video"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No video file uploaded",
        });
      }

      const sanitizedName = sanitizeFilename(req.file.originalname);
      const uniqueName = `${Date.now()}-${sanitizedName}`;
      const uri = await uploadBuffer(
        uniqueName,
        req.file.buffer,
        req.file.mimetype
      );

      const { id } = await prisma.video.create({
        data: {
          uri,
          title: "",
          description: "",
          uniqueName,
          mimetype: req.file.mimetype,
          size: req.file.size,
          originalName: req.file.originalname,
        },
      });
      res.json({
        success: true,
        data: {
          id,
          filename: uniqueName,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          path: uri,
          uniqueName,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      });
    }
  }
);

router.use(
  (error: Error, req: Request, res: Response, next: express.NextFunction) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          error: "Video is too large. Maximum size is 60 MB.",
        });
      }
    }

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
);

export default router;
