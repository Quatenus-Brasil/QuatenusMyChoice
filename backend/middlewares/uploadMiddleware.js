import multer from "multer";
import path from "path";
import fs from "fs";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const createUploader = (folder) => {
  const dest = path.join("uploads", folder);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      cb(null, dest);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, uniqueName);
    },
  });

  const fileFilter = (_req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error("Tipo de arquivo não permitido. Use JPG, PNG ou WebP."));
    }
    cb(null, true);
  };

  return multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE_BYTES } });
};

export { createUploader };
