import multer from "multer";

// Define storage configuration
const storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

export default upload;
