import { Request } from "express";
import multer from "multer";
import {
  cloudinary,
  storage,
} from "../../services/CloudinaryConfig/cloudinaryConfig";
const upload = multer({
  storage: storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image support!"));
    }
  },
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});

export default upload;
