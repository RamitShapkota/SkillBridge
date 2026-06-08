import multer from "multer";
import path from "path"; // 1. You must import path here

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

export const upload = multer({ storage });
