import multer from "multer";
import path from "path"; // 1. You must import path here
import { ApiError } from "../utils/ApiError.js";

const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    //  2. Get the extension of the original file (e.g., '.jpg' or '.png')
    const fileExtension = path.extname(file.originalname);

    // 3. Append the extension to the end of your filename
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

const fileFilter = function (req, file, cb) {
  if (!allowedImageTypes.includes(file.mimetype)) {
    cb(new ApiError(400, "Only JPG, JPEG, PNG and WEBP image files are allowed"));
    return;
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter,
});
